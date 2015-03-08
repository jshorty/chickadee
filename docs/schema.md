# Schema Information

## users
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
email           | string    | not null, unique, indexed
password_digest | string    | not null
session_token   | string    | not null
alias           | string    |
image_url       | string    |

## birds
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
common_name     | string    | not null, unique
scientific_name | string    | not null, unique
song_description| string    | (substitute for mp3 initially)
audio_query_url | string    |

## regions
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
county          | string    | scoped uniqueness (state)
state           | string    | scoped uniqueness (country)
country         | string    | not null, enforce uniqueness when county/state left blank (how?)
ebird_query_url | string    |

## user_regions (JOIN TABLE)
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
user_id     | integer   | not null, foreign key (references users)
region_id   | integer   | not null, foreign key (references regions), indexed

## bird_regions (JOIN TABLE)
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
bird_id     | integer   | not null, foreign key (references birds)
region_id   | integer   | not null, foreign key (references regions), indexed

## quizzes
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
user_id     | integer   | not null, foreign key (references users), indexed
region_id   | integer   | not null, foreign key (references regions)
progress    | integer   | not null, default 0
score       | integer   | not null, default 0

## questions
column name | data type | details
------------|-----------|-----------------------
id          | integer   | not null, primary key
quiz_id     | integer   | not null, foreign key (references quizzes), indexed
bird_id     | integer   | not null, foreign key (references birds)
answered    | boolean   | not null, default false
correct     | boolean   | not null, default false

# Associations
## users
has_many user_regions;
has_many regions through user_regions;
has_many bird_regions;
has_many birds though bird_regions;
has_many quizzes;
has_many questions through quizzes**;

##user_regions
belongs_to user;
belongs_to region;

##regions
has_many user_regions;
has_many users through user_regions;
has_many bird_regions;
has_many birds through bird_regions;
has_many quizzes**;

##bird_regions
belongs_to region;
belongs_to bird;

##birds
has_many bird_regions;
has_many regions through bird_regions;
has_many users through regions;

##quizzes
has_many questions;
belongs_to user;
belongs_to region**;

##questions
belongs_to quiz;
belongs_to bird**;

**unsure if needed
