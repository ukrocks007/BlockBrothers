pragma solidity ^0.4.23;

contract InsurancePlan{
    //Properties
    string public name;
    string public provider;
    uint public premium;

    constructor(string planName, string providerName, uint premiumAmount) public {
        name = planName;
        provider = providerName;
        premium = premiumAmount;
    }
}

contract Insurance {
    //Properties
    uint userId;
    uint insureanceType;
    uint public premium;
    uint public catastropheCost;
    address public planContract;

    //Contract addresses
    address factoryContract;
    address paymentContract;
    address claimsContract;

    //User wallet address
    address public walletAddr;

    //Properties for duration of insurance
    uint public duration;
    uint public policyStarted;

    //State if insurance contract
    enum States {Inactive, Active, ClaimRequested, Closed}
    States public state;

    constructor(uint id, uint insurenceTypeid, uint catastropheAmt, address planAddress, address catastropheAcc,
    address userWalletAddr, uint months, address paymentInterface, address claimsInterface) public {
        userId = id;
        insureanceType = insurenceTypeid;
        state = States.Inactive;
        catastropheCost = catastropheAmt;
        planContract = planAddress;
        premium = InsurancePlan(planContract).premium();
        factoryContract = catastropheAcc;
        walletAddr = userWalletAddr;
        duration = months;
        policyStarted = 0;
        paymentContract = paymentInterface;
        claimsContract = claimsInterface;
    }

    //Checks eligibility of contract for a claim
    function isEligibleForClaim() public restricted view returns (bool){
        return state == States.Active;
    }

    //Updates the state of the contract
    function PremiumPaid() public restricted {
        require(state == States.Inactive || state == States.Active);
        if(policyStarted == 0)
            policyStarted = now;
        state = States.Active;
    }

    //Updates the state of the contract
    function ClaimApproved() public restricted {
        require(state == States.Active);
        policyStarted = 0;
        state = States.Inactive;
    }

    //Updates the state of the contract
    function withdrawFunds() public restricted {
        policyStarted = 0;
        state = States.Inactive;
    }

    //Updates the state of the contract
    function closeInsurance() public restricted {
        state = States.Closed;
    }

    function getSummary() public view returns (
      uint, uint, uint, uint, uint
      ) {
        return (
          premium,
          catastropheCost,
          policyStarted,
          duration,
          uint(state)
        );
    }

    modifier restricted {
        require(msg.sender == factoryContract || msg.sender == paymentContract || msg.sender == claimsContract);
        _;
    }
}

//This contract stores all the premium amount except catastrophe fee.
contract PiggyBank {
    address factoryContract;
    Claims public ClaimsInterface;
    Payments public PaymentInterface;

    constructor(address factory) public {
        factoryContract = factory;

        //Create payment and claims interfaces
        ClaimsInterface = new Claims(factoryContract, this);
        PaymentInterface = new Payments(factoryContract, this);
    }

    function() public payable { }

    //Used to send funds to a particular address
    function SendFundsToAddress(uint amount, address receiver) public {
        require(msg.sender == factoryContract || msg.sender == address(ClaimsInterface));
        require(address(this).balance >= amount, "Bank doesn`t have enough balance!");
        if(!address(receiver).send(amount)){
            require(false, "Transfer failed!");
        }
    }
}

//Handles premium payments.
contract Payments {
    address factoryContract;
    address bankContract;

    constructor(address factory, address bank) public {
        factoryContract = factory;
        bankContract = bank;
    }

    //User will call this from the User interface to pay premium.
    function payPremium(uint userId, address insuranceContract) public payable {
        require(InsuranceFactory(factoryContract).InsuranceExists(userId,insuranceContract));
        uint catastropheCost = Insurance(insuranceContract).catastropheCost();
        uint amountToPay = Insurance(insuranceContract).premium() + catastropheCost;
        require(amountToPay <= msg.value);

        //Save catastrophe fee in factory contract.
        if(address(this).balance > catastropheCost){
            if(!address(factoryContract).send(catastropheCost)){
                require(false);
            }
        }

        //Saves the premium amount to piggy bank.
        if((address(this).balance - Insurance(insuranceContract).premium()) >= 0){
            if(!address(bankContract).send(Insurance(insuranceContract).premium())){
                require(false);
            }
        }
        Insurance(insuranceContract).PremiumPaid();
    }
}

contract ClaimRequest {
    uint public userId;
    uint public amount;
    address public insuranceContract;
    bool public approved;
    address claimsContract;
    string public claimReason;

    constructor(uint id, uint amt, address insurance, address claims, string reason) public {
        userId = id;
        amount = amt;
        insuranceContract = insurance;
        approved = false;
        claimsContract = claims;
        claimReason = reason;
    }

    function claimApproved() public {
        require(msg.sender == claimsContract);
        approved = true;
    }
}

//Takes care of all the claim related functions.
contract Claims {
    address factoryContract;
    address bankContract;

    //Keeps the list of all requests.
    ClaimRequest[] public requests;
    mapping(uint => ClaimRequest[]) userRequests;

    constructor(address factory, address bank) public {
        factoryContract = factory;
        bankContract = bank;
    }

    function withdrawFunds(uint userId, address insurance) public {

        //The insurance should belong to user requesting claim.
        require(InsuranceFactory(factoryContract).InsuranceExists(userId,insurance));

        //Only user who has the Insurance can request claim.
        require(Insurance(insurance).walletAddr() == msg.sender);

        //Check if already claimed.
        require(Insurance(insurance).isEligibleForClaim());

        //Duration is in year.
        uint factor = 1 days * 365;
        uint policyStarted = Insurance(insurance).policyStarted();
        uint duration = Insurance(insurance).duration();
        address userWallet = Insurance(insurance).walletAddr();
        uint amount = Insurance(insurance).premium();

        //Checks if policy is matured.
        require((now - policyStarted) >= (duration * factor));

        PiggyBank(bankContract).SendFundsToAddress(amount, userWallet);

        Insurance(insurance).withdrawFunds();
    }

    function requestClaim(uint userId, uint amount, address insurance, string reason) public {

        //The insurance should belong to user requesting claim.
        require(InsuranceFactory(factoryContract).InsuranceExists(userId,insurance));

        //Only user who has the Insurance can request claim.
        require(Insurance(insurance).walletAddr() == msg.sender);

        //Check if already claimed.
        require(Insurance(insurance).isEligibleForClaim());

        //Create a claim request
        ClaimRequest newRequest = new ClaimRequest(userId, amount, insurance, this, reason);

        //Save the claim request
        requests.push(newRequest);

        userRequests[userId].push(newRequest);
    }

    function getRequestsForUser(uint userId) public view returns(ClaimRequest[]){
        return userRequests[userId];
    }

    function ApproveClaim(address claimRequest) public {

        //Can only be called from InsuranceFactory
        require(msg.sender == factoryContract);

        //Find the request
        ClaimRequest req = ClaimRequest(claimRequest);

        //Check for a valid user and insurance combo.
        require(InsuranceFactory(factoryContract).InsuranceExists(req.userId(), req.insuranceContract()));

        address walletAddress = Insurance(req.insuranceContract()).walletAddr();
        uint premium = Insurance(req.insuranceContract()).premium();

        //Less then premium amount
        if(req.amount() <= premium){
            PiggyBank(bankContract).SendFundsToAddress(req.amount(), walletAddress);
        }
        //More than premium paid
        else{
            InsuranceFactory(factoryContract).UseCatastropheFund(req.amount()-premium, walletAddress);
        }

        //Change state of contract.
        Insurance(req.insuranceContract()).ClaimApproved();
        req.claimApproved();
    }
}

contract InsuranceFactory{
    uint public catastropheBalance;
    mapping(uint => mapping(address => bool)) public list;
    mapping(uint => address[]) public userInsuranceList;

    mapping(address => bool) public availablePlans;
    address[] public plans;

    PiggyBank public Bank;
    Payments public  PaymentInterface;
    Claims public ClaimsInterface;

    struct PlanInfo
    {
        address addr;
        string name;
        string provider;
        uint premium;
    }

    constructor() public {
        Bank = new PiggyBank(this);
        PaymentInterface = Bank.PaymentInterface();
        ClaimsInterface = Bank.ClaimsInterface();
    }

    //Wallet will user this function to create insurance
    function createInsurance(uint userId, uint insuranceType, uint catastropheFee, address planAddress, uint duration) public{
        address newContract = new Insurance(userId, insuranceType, catastropheFee, planAddress, this,
        msg.sender, duration, PaymentInterface, ClaimsInterface);

        list[userId][address(newContract)]=true;
        userInsuranceList[userId].push(address(newContract));
    }

     //Wallet will user this function to create insurance plans
    function createInsurancePlan(string name, string provider, uint amount) public{
        address newPlan = new InsurancePlan(name, provider, amount);

        availablePlans[newPlan] = true;
        plans.push(newPlan);
    }

    //This function will approve and transfer funds for a claim request.
    function approveClaim(address claimRequest) public {
        ClaimsInterface.ApproveClaim(claimRequest);
    }

    //Checks if insurance address exists fir given user.
    function InsuranceExists(uint userid, address insurance) public view returns (bool){
        return list[userid][insurance];
    }

    //returns list of insurances for a user.
    function getUserInsurances(uint userId) public view returns(address[]){
        return userInsuranceList[userId];
    }

    //returns list of insurances plan information.
    function getInsurancePlanInfo(address planAddr) public view returns(address, string, string, uint){
        InsurancePlan plan = InsurancePlan(planAddr);
        return (
            planAddr,
            plan.name(),
            plan.provider(),
            plan.premium()
            );
    }

    function getInsurancePlanList() public view returns(address[]){
        return plans;
    }

    //Total catastrophe fund
    function getCatastropheBalance() public view returns(uint256){
        return address(this).balance;
    }

    //Uses catastrophe fund to pay for the claims.
    function UseCatastropheFund(uint amount, address insuredAddr) public {
        require(msg.sender == address(ClaimsInterface));
        require(amount <= address(this).balance);
        if(!address(insuredAddr).send(amount)){
            require(false);
        }
    }

    function() public payable { }
}
