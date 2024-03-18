# Proof Market Centralized

# Client flow

1. Get message to sign for authorisation (GET /user/metamask/message)
2. Sign message via metamask
3. Send signed message to get JWT (POST /user/metamask)
4. (Optional) Get PM system info with deposit address (GET /system/info)
5. (Optional) Send blockchain transaction to call ``function deposit() public payable``
6. View available statements (GET /statement)
7. (Optional) Create new statement if needed (POST /statement)
8. Get book and statistics for statement (GET /book/:statementId)
9. (Optional) Get user info to check balance (GET /user/info)
10. Create request for statement (POST /request)
11. (Optional) Delete request in case of request recreation (DELETE /request/:id)
12. Check request states (GET /request or /request/:id)
13. Waiting request status is DONE
14. Get proof for request (GET /proof/:id)
15. Return to step 10

# Producer flow

1. Get message to sign for auth (GET /user/metamask/message)
2. Sign message via metamask
3. Send signed message to get JWT (POST /user/metamask)
4. Get user info (GET /user/info)
5. (Optional) Register as producer (POST /producer/register)
6. View available statements (GET /statement)
7. Get book and statistics for statement (GET /book/:statementId)
8. Create proposal for statement (POST /proposal)
9. Waiting for assigned requests (GET /book/assigned)
10. Collection request input from request and generate proof
11. Submit proof (POST /proof)
12. Return to step 8


# Configs(DEV)

- Network - ETH SEPOLIA
- Contract - 0x1ed7daacb963a579D83f3c1569BDA7D199a02A4E
- Admin PK - b4f1d55cb2c640305904c085ddf919865510d7da5d1023a919e2330d3db4b055
