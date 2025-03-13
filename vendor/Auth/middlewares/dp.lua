
System Actors:
1- Owner
2- Point Of Payments
3- User
4- Companies
--------------------------------
Tables:
- Countries
  - id, name
- Cities
  - id, name, city_id
- User
  - id
  - fullName
  - gender
  - email (unique)
  - mobile (unique)
  - email_verified_at (null)
  - national_id (unique)
  - birth_date
  - country_id
  - city_id
  --------------------------
  - wallet *
    - id
    - user_id
    - old_balance
    - amount

    - date
  --------------------------
  - actionsp
    - id
    - old_balance
    - new_balance
    - amount
    - date
    - verification_code
    - verified_at
    - wallet_id
    - user_id
    - operation_type (Model)
    - operation_id
  --------------------------
  - payments
    - id
    - charging_point_id
    - wallet_id
    - user_id
    - company_branch_id
    - company_id
  --------------------------
  - chargings
    - id
    - old_balance
    - new_balance
    - amount
    - date
    - verification_code
    - verified_at
    - charging_point_id
    - wallet_id
    - user_id
  --------------------------
  - transfers
    - id
    - source_id
    - target_id
    - amount
    - date
    - info
  --------------------------
  - charging_points
    - 
  --------------------------
  - categories
    - id, name
  --------------------------
  - companies
    - id
    - name
    - image
    - category_id
    - info
    - mobile
    - email
    - verified_at
    - owner_id
  --------------------------
  - owners
    - name
    - national_id
  --------------------------
  - companies_branches
    - id
    - company_id
    - city_id
    - address
    - street
    - building
    - mobile


  -----------------------------
  - gender        email
    M             email@app.com
    F             email@app.com
    M             email-2@app.com

    - object_type object_id role_id
      User        1         1       
      User        1         1       