// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract AdmissionPBFTLite {
    struct College {
        uint256 id;
        string name;
        uint256 minMarks;
        bool exists;
    }

    struct Applicant {
        string name;
        uint256 id;
        uint256 score;
        string marksheetProof;
        uint256[3] preferences;
        string status;
        uint256 timestamp;
        address submitter;
        bool exists;
    }

    address public deployer;
    mapping(uint256 => College) public colleges;
    uint256[] public collegeIds;

    mapping(uint256 => Applicant) public applicants;
    uint256[] public applicantIds;

    event CollegeAdded(uint256 id, string name, uint256 minMarks);
    event ApplicationSubmitted(
        uint256 studentId,
        string name,
        uint256 score,
        string status,
        uint256 timestamp
    );
    event StatusUpdated(uint256 studentId, string newStatus);

    constructor() {
        deployer = msg.sender;
    }

    // --- College Management ---
    function addCollege(uint256 id, string memory name, uint256 minMarks) public {
        require(!colleges[id].exists, "Already exists");
        colleges[id] = College(id, name, minMarks, true);
        collegeIds.push(id);
        emit CollegeAdded(id, name, minMarks);
    }

    function getAllColleges()
    public
    view
    returns (uint256[] memory ids, string[] memory names, uint256[] memory minMarks)
{
    uint256 len = collegeIds.length;
    ids = new uint256[](len);
    names = new string[](len);
    minMarks = new uint256[](len);

    for (uint256 i = 0; i < len; i++) {
        uint256 id = collegeIds[i];
        College memory c = colleges[id];
        ids[i] = c.id;
        names[i] = c.name;
        minMarks[i] = c.minMarks;
    }
}


    // --- Admission Application ---
    function applyForAdmission(
        uint256 studentId,
        string memory name,
        uint256 score,
        string memory marksheetProof,
        uint256[3] memory preferences
    ) public {
        require(!applicants[studentId].exists, "Already applied");
        applicants[studentId] = Applicant({
            name: name,
            id: studentId,
            score: score,
            marksheetProof: marksheetProof,
            preferences: preferences,
            status: "Submitted",
            timestamp: block.timestamp,
            submitter: msg.sender,
            exists: true
        });
        applicantIds.push(studentId);
        emit ApplicationSubmitted(studentId, name, score, "Submitted", block.timestamp);
    }

    function updateStatus(uint256 studentId, string memory newStatus) public {
        require(applicants[studentId].exists, "Not found");
        applicants[studentId].status = newStatus;
        emit StatusUpdated(studentId, newStatus);
    }

    function getAllApplicants() public view returns (Applicant[] memory) {
        Applicant[] memory list = new Applicant[](applicantIds.length);
        for (uint256 i = 0; i < applicantIds.length; i++) {
            list[i] = applicants[applicantIds[i]];
        }
        return list;
    }
}
