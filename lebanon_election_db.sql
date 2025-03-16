-- ================================
-- 1) ADMINISTRATIVE DIVISIONS
-- ================================

-- GOVERNORATE (Mohafaza)
CREATE TABLE Governorate (
    governorate_id   SERIAL PRIMARY KEY,
    governorate_name VARCHAR(100) NOT NULL UNIQUE
);

-- DISTRICT (Caza)
CREATE TABLE District (
    district_id    SERIAL PRIMARY KEY,
    district_name  VARCHAR(100) NOT NULL UNIQUE,
    governorate_id INT REFERENCES Governorate(governorate_id) ON DELETE CASCADE
);

-- MUNICIPALITY (Baladiyah)
CREATE TABLE Municipality (
    municipality_id   SERIAL PRIMARY KEY,
    municipality_name VARCHAR(100) UNIQUE NOT NULL,
    district_id       INT REFERENCES District(district_id) ON DELETE CASCADE
);

-- ================================
-- 2) ELECTION TABLES
-- ================================

-- ELECTION_YEAR
CREATE TABLE Election_Year (
    election_year_id SERIAL PRIMARY KEY,
    year INT UNIQUE NOT NULL
      CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 10)
);

-- ELECTION_TYPE (Parliamentary, Municipal, Mukhtar, etc.)
CREATE TABLE Election_Type (
    election_type_id SERIAL PRIMARY KEY,
    type_name        VARCHAR(100) UNIQUE NOT NULL
);

-- ELECTION_DISTRICT (e.g. "North II", "Beirut I")
CREATE TABLE Election_District (
    election_district_id SERIAL PRIMARY KEY,
    district_name        VARCHAR(100) UNIQUE NOT NULL
);

-- ================================
-- 3) REFERENCE / LOOKUP TABLES
-- ================================

CREATE TABLE Blood_Type (
    blood_type_id   SERIAL PRIMARY KEY,
    blood_type_name VARCHAR(10) UNIQUE NOT NULL
);

CREATE TABLE Marital_Status (
    marital_status_id SERIAL PRIMARY KEY,
    status_name       VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE Education_Level (
    education_level_id SERIAL PRIMARY KEY,
    level_name         VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Support_Status (
    support_status_id SERIAL PRIMARY KEY,
    status_name       VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Address (
    address_id SERIAL PRIMARY KEY,
    city       VARCHAR(100) NOT NULL,
    road       VARCHAR(100),
    building   VARCHAR(100),
    floor      VARCHAR(50),
    nearby     VARCHAR(255)
);

-- ================================
-- 4) LISTS & CANDIDATES
-- ================================

CREATE TABLE List (
    list_id   SERIAL PRIMARY KEY,
    list_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE List_Candidates (
    list_candidate_id SERIAL PRIMARY KEY,
    list_id           INT REFERENCES List(list_id) ON DELETE CASCADE,
    candidate_id      INT UNIQUE NOT NULL,
    candidate_name    VARCHAR(100) NOT NULL
);

-- ================================
-- 5) MUKHTAR
-- ================================

CREATE TABLE Mukhtar (
    mukh_id   SERIAL PRIMARY KEY,
    mukh_name VARCHAR(100) UNIQUE NOT NULL
);

-- ================================
-- 6) MAIN CITIZENS TABLE (VOTERS)
-- ================================

CREATE TABLE Citizens_Gov (
    citizens_gov_id SERIAL PRIMARY KEY,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    father_name     VARCHAR(100),
    mother_name     VARCHAR(100),
    dob             DATE NOT NULL CHECK (dob < CURRENT_DATE),
    personal_doctrine VARCHAR(100),
    gender          VARCHAR(50) CHECK (gender IN ('Male', 'Female', 'Other')) NOT NULL,
    reg_number      VARCHAR(50) UNIQUE NOT NULL,
    doctrine        VARCHAR(100),

    -- Official paternal municipality (for municipal / mukhtar votes)
    municipality_id INT REFERENCES Municipality(municipality_id) ON DELETE SET NULL
);

-- ================================
-- 7) CITIZEN ATTRIBUTES
-- ================================

CREATE TABLE Citizen_Attrib (
    citizen_attrib_id  SERIAL PRIMARY KEY,
    citizens_gov_id    INT REFERENCES Citizens_Gov(citizens_gov_id) ON DELETE CASCADE,

    blood_type_id      INT REFERENCES Blood_Type(blood_type_id)         ON DELETE SET NULL,
    marital_status_id  INT REFERENCES Marital_Status(marital_status_id) ON DELETE SET NULL,
    national_id_number VARCHAR(50) UNIQUE NOT NULL,
    mobile_number      VARCHAR(20) UNIQUE NOT NULL,
    alternative_mobile_number VARCHAR(20),
    email_address      VARCHAR(100) UNIQUE NOT NULL
      CHECK (email_address LIKE '%@%'),
    education_level_id INT REFERENCES Education_Level(education_level_id) ON DELETE SET NULL,
    job_title          VARCHAR(100),
    belong_2_syndicate BOOLEAN DEFAULT FALSE,
    address_id         INT REFERENCES Address(address_id) ON DELETE SET NULL,
    profile_picture    TEXT CHECK (profile_picture ~* '^https?:\/\/.*$'),

    support_status_id  INT REFERENCES Support_Status(support_status_id) ON DELETE SET NULL,
    mukh_id            INT REFERENCES Mukhtar(mukh_id) ON DELETE SET NULL
);

-- ================================
-- 8) SYSTEM_USER (MANDATORY)
-- ================================

CREATE TABLE system_users (
    user_id      SERIAL PRIMARY KEY,
    citizen_id   INT REFERENCES Citizens_Gov(citizens_gov_id) ON DELETE CASCADE,
    user_name    VARCHAR(100) UNIQUE NOT NULL,
    user_email   VARCHAR(150) UNIQUE NOT NULL CHECK (user_email LIKE '%@%'),
    password     TEXT NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    role         VARCHAR(50) NOT NULL DEFAULT 'delegate'
);

-- ================================
-- 9) MINI-TABLES (VOLUNTEER, DRIVER, LEADER)
-- ================================

CREATE TABLE Volunteer (
    volunteer_id    SERIAL PRIMARY KEY,
    citizen_id      INT REFERENCES Citizens_Gov(citizens_gov_id) ON DELETE CASCADE,
    is_voter        BOOLEAN DEFAULT FALSE,
    volunteer_role  VARCHAR(100)
);

CREATE TABLE Logistics_Driver (
    logistics_driver_id SERIAL PRIMARY KEY,
    citizen_id          INT REFERENCES Citizens_Gov(citizens_gov_id) ON DELETE CASCADE,
    is_voter            BOOLEAN DEFAULT FALSE,
    vehicle_info        TEXT
);

CREATE TABLE Leader_Reference (
    leader_reference_id SERIAL PRIMARY KEY,
    citizen_id          INT REFERENCES Citizens_Gov(citizens_gov_id) ON DELETE CASCADE,
    is_voter            BOOLEAN DEFAULT FALSE,
    description         TEXT
);

-- ================================
-- 10) RELATIVES & SERVICES (CRM)
-- ================================

CREATE TABLE Relatives_Details (
    relatives_details_id SERIAL PRIMARY KEY,
    citizens_gov_id      INT REFERENCES Citizens_Gov(citizens_gov_id) ON DELETE CASCADE,
    full_name            VARCHAR(200) NOT NULL,
    relationship_type    VARCHAR(100),
    r_dob                DATE CHECK (r_dob < CURRENT_DATE),
    address_id           INT REFERENCES Address(address_id) ON DELETE SET NULL,
    marital_status_id    INT REFERENCES Marital_Status(marital_status_id) ON DELETE SET NULL
);

CREATE TABLE Citizens_Services (
    citizens_services_id SERIAL PRIMARY KEY,
    citizens_gov_id      INT REFERENCES Citizens_Gov(citizens_gov_id) ON DELETE CASCADE,
    relative_service     BOOLEAN DEFAULT FALSE,
    relatives_details_id INT REFERENCES Relatives_Details(relatives_details_id) ON DELETE SET NULL,
    service_type_id      INT,  -- references a Service_Type table if desired
    service_status_id    INT,  -- references a Service_Status table if desired
    service_description  TEXT
);

-- ================================
-- 11) CITIZEN_VOTE_PREFERENCE
-- ================================

CREATE TABLE Citizen_Vote_Preference (
    vote_preference_id   SERIAL PRIMARY KEY,
    citizen_id           INT REFERENCES Citizens_Gov(citizens_gov_id) ON DELETE CASCADE,

    election_year_id     INT REFERENCES Election_Year(election_year_id) ON DELETE CASCADE,
    election_type_id     INT REFERENCES Election_Type(election_type_id) ON DELETE CASCADE,

    -- Parliamentary (Link to Election_District)
    election_district_id INT REFERENCES Election_District(election_district_id) ON DELETE SET NULL,
    -- Municipal / Mukhtar (Link to citizen's municipality)
    municipality_id      INT REFERENCES Municipality(municipality_id) ON DELETE SET NULL,

    list_id              INT REFERENCES List(list_id) ON DELETE SET NULL,
    fav1_candidate_id    INT REFERENCES List_Candidates(candidate_id) ON DELETE SET NULL,
    fav2_candidate_id    INT REFERENCES List_Candidates(candidate_id) ON DELETE SET NULL,

    created_at           TIMESTAMP DEFAULT NOW()
);

