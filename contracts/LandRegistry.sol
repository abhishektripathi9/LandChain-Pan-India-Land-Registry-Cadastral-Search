// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LandRegistry
 * @dev Decentralized Land Registry and Title Transfer Smart Contract for LandChain DApp
 * Features:
 * - Immutable Land Registration with IPFS Document CID Hashing
 * - District Authority / Inspector Role-Based Verification
 * - Secure Ownership Transfer with Provenance / Chronological History Tracking
 * - Event Logging for Real-Time Blockchain Explorer & Notification Systems
 */
contract LandRegistry {
    address public admin;

    enum LandStatus {
        Pending,
        Approved,
        Rejected
    }

    struct OwnershipRecord {
        address from;
        address to;
        uint256 timestamp;
        uint256 priceInWei;
        string reason;
    }

    struct Land {
        uint256 id;
        string surveyNumber;
        string location;
        string village;
        string district;
        string stateName;
        uint256 areaSqFt;
        string landType;
        uint256 marketValueInWei;
        string ipfsDocCID;
        address currentOwner;
        LandStatus status;
        uint256 registrationTimestamp;
        string rejectionReason;
        bool exists;
    }

    uint256 private _landIdCounter;
    mapping(address => bool) public isAuthority;
    mapping(uint256 => Land) public lands;
    mapping(uint256 => OwnershipRecord[]) private _landHistory;
    mapping(address => uint256[]) private _ownerLands;
    uint256[] private _allLandIds;

    // Events
    event LandRegistered(
        uint256 indexed landId,
        string surveyNumber,
        address indexed owner,
        string ipfsDocCID,
        uint256 timestamp
    );

    event LandVerified(
        uint256 indexed landId,
        LandStatus status,
        address indexed authority,
        string reason,
        uint256 timestamp
    );

    event LandTransferred(
        uint256 indexed landId,
        address indexed from,
        address indexed to,
        uint256 priceInWei,
        uint256 timestamp
    );

    event AuthorityAdded(address indexed authority);
    event AuthorityRemoved(address indexed authority);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "LandRegistry: Only admin can perform this action");
        _;
    }

    modifier onlyAuthority() {
        require(isAuthority[msg.sender] || msg.sender == admin, "LandRegistry: Only authorized registrar can perform this action");
        _;
    }

    modifier onlyLandOwner(uint256 _landId) {
        require(lands[_landId].exists, "LandRegistry: Land does not exist");
        require(lands[_landId].currentOwner == msg.sender, "LandRegistry: Only current owner can perform this action");
        _;
    }

    modifier landMustExist(uint256 _landId) {
        require(lands[_landId].exists, "LandRegistry: Land parcel not found");
        _;
    }

    constructor() {
        admin = msg.sender;
        isAuthority[msg.sender] = true;
        emit AuthorityAdded(msg.sender);
    }

    /**
     * @notice Add a new district land registrar/authority
     */
    function addAuthority(address _authority) external onlyAdmin {
        require(_authority != address(0), "Invalid address");
        require(!isAuthority[_authority], "Already an authority");
        isAuthority[_authority] = true;
        emit AuthorityAdded(_authority);
    }

    /**
     * @notice Remove an existing district land registrar/authority
     */
    function removeAuthority(address _authority) external onlyAdmin {
        require(isAuthority[_authority], "Not an authority");
        require(_authority != admin, "Cannot remove admin");
        isAuthority[_authority] = false;
        emit AuthorityRemoved(_authority);
    }

    /**
     * @notice Register a new land parcel
     */
    function registerLand(
        string memory _surveyNumber,
        string memory _location,
        string memory _village,
        string memory _district,
        string memory _stateName,
        uint256 _areaSqFt,
        string memory _landType,
        uint256 _marketValueInWei,
        string memory _ipfsDocCID
    ) external returns (uint256) {
        require(bytes(_surveyNumber).length > 0, "Survey number is required");
        require(bytes(_ipfsDocCID).length > 0, "IPFS Document CID is required");

        _landIdCounter++;
        uint256 newLandId = _landIdCounter;

        lands[newLandId] = Land({
            id: newLandId,
            surveyNumber: _surveyNumber,
            location: _location,
            village: _village,
            district: _district,
            stateName: _stateName,
            areaSqFt: _areaSqFt,
            landType: _landType,
            marketValueInWei: _marketValueInWei,
            ipfsDocCID: _ipfsDocCID,
            currentOwner: msg.sender,
            status: LandStatus.Pending,
            registrationTimestamp: block.timestamp,
            rejectionReason: "",
            exists: true
        });

        _allLandIds.push(newLandId);
        _ownerLands[msg.sender].push(newLandId);

        // Record initial registration in history
        _landHistory[newLandId].push(OwnershipRecord({
            from: address(0),
            to: msg.sender,
            timestamp: block.timestamp,
            priceInWei: _marketValueInWei,
            reason: "Initial Land Registration"
        }));

        emit LandRegistered(newLandId, _surveyNumber, msg.sender, _ipfsDocCID, block.timestamp);
        return newLandId;
    }

    /**
     * @notice Verify and approve or reject a land registration
     */
    function verifyLand(
        uint256 _landId,
        LandStatus _status,
        string memory _reason
    ) external onlyAuthority landMustExist(_landId) {
        require(_status == LandStatus.Approved || _status == LandStatus.Rejected, "Invalid verification status");

        Land storage land = lands[_landId];
        land.status = _status;
        if (_status == LandStatus.Rejected) {
            land.rejectionReason = _reason;
        } else {
            land.rejectionReason = "";
        }

        emit LandVerified(_landId, _status, msg.sender, _reason, block.timestamp);
    }

    /**
     * @notice Transfer land ownership to a new verified owner
     */
    function transferLandOwnership(
        uint256 _landId,
        address _newOwner,
        uint256 _priceInWei,
        string memory _reason
    ) external onlyLandOwner(_landId) {
        require(_newOwner != address(0), "Invalid recipient address");
        require(_newOwner != msg.sender, "Cannot transfer to yourself");
        Land storage land = lands[_landId];
        require(land.status == LandStatus.Approved, "Land must be approved before transfer");

        address previousOwner = land.currentOwner;
        land.currentOwner = _newOwner;

        // Update ownership records
        _landHistory[_landId].push(OwnershipRecord({
            from: previousOwner,
            to: _newOwner,
            timestamp: block.timestamp,
            priceInWei: _priceInWei,
            reason: bytes(_reason).length > 0 ? _reason : "Ownership Title Transfer"
        }));

        _ownerLands[_newOwner].push(_landId);

        emit LandTransferred(_landId, previousOwner, _newOwner, _priceInWei, block.timestamp);
    }

    /**
     * @notice Fetch complete details of a specific land parcel
     */
    function getLand(uint256 _landId) external view landMustExist(_landId) returns (Land memory) {
        return lands[_landId];
    }

    /**
     * @notice Fetch complete provenance ownership history of a land parcel
     */
    function getLandHistory(uint256 _landId) external view landMustExist(_landId) returns (OwnershipRecord[] memory) {
        return _landHistory[_landId];
    }

    /**
     * @notice Fetch all registered land parcels
     */
    function getAllLands() external view returns (Land[] memory) {
        uint256 total = _allLandIds.length;
        Land[] memory items = new Land[](total);
        for (uint256 i = 0; i < total; i++) {
            items[i] = lands[_allLandIds[i]];
        }
        return items;
    }

    /**
     * @notice Fetch land parcel IDs owned by a specific address
     */
    function getLandsByOwner(address _owner) external view returns (uint256[] memory) {
        return _ownerLands[_owner];
    }

    /**
     * @notice Total number of registered parcels
     */
    function getTotalLands() external view returns (uint256) {
        return _allLandIds.length;
    }
}
