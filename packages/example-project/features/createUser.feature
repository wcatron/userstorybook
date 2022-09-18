Feature: Create User

    Scenario: Admin makes admin
        Given an admin named 'John'
        When we attempt to create a user with the admin role and name 'Sarah'
        Then we should recieve an newly created admin back
    Scenario: Not admin makes admin
        Given a user that is not an admin
        When we attempt to create a user with the admin role and name 'Sarah'
        Then we should recieve an error
    Scenario: Admin makes bad admin
        Given an admin named 'John'
        When we attempt to create a user with the admin role and name 'Mark'
        Then we should recieve an error
    Scenario: Bad admin makes an admin
        Given an admin named 'Not John or Sarah'
        When we attempt to create a user with the admin role and name 'John'
        Then we should recieve an error
    Scenario: Non logged in attempt
        Given an unauthenticated session
        When we attempt to create a user with the admin role and name 'Sarah'
        Then we should recieve an error