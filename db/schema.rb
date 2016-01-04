# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160104003414) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "bird_photos", force: :cascade do |t|
    t.integer  "bird_id",                            null: false
    t.boolean  "local",              default: false
    t.string   "file_url",                           null: false
    t.string   "flickr_url",                         null: false
    t.string   "owner"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
  end

  create_table "bird_regions", force: :cascade do |t|
    t.integer  "region_id",  null: false
    t.integer  "bird_id",    null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "bird_regions", ["region_id"], name: "index_bird_regions_on_region_id", using: :btree

  create_table "birds", force: :cascade do |t|
    t.string  "common_name", null: false
    t.string  "sci_name",    null: false
    t.string  "song_desc"
    t.boolean "has_songs"
  end

  add_index "birds", ["common_name"], name: "index_birds_on_common_name", unique: true, using: :btree
  add_index "birds", ["sci_name"], name: "index_birds_on_sci_name", unique: true, using: :btree

  create_table "questions", force: :cascade do |t|
    t.integer  "quiz_id",                    null: false
    t.integer  "bird_id",                    null: false
    t.boolean  "answered",   default: false, null: false
    t.boolean  "correct",    default: false, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "choice_a",                   null: false
    t.integer  "choice_b",                   null: false
    t.integer  "choice_c",                   null: false
  end

  add_index "questions", ["quiz_id"], name: "index_questions_on_quiz_id", using: :btree

  create_table "quizzes", force: :cascade do |t|
    t.integer  "user_id",                 null: false
    t.integer  "region_id",               null: false
    t.integer  "progress",   default: 0,  null: false
    t.integer  "score",      default: 0,  null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "history",    default: [],              array: true
  end

  add_index "quizzes", ["progress"], name: "index_quizzes_on_progress", using: :btree
  add_index "quizzes", ["user_id"], name: "index_quizzes_on_user_id", using: :btree

  create_table "regions", force: :cascade do |t|
    t.string   "county"
    t.string   "state"
    t.string   "country",            null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "code",               null: false
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
  end

  create_table "songs", force: :cascade do |t|
    t.integer  "bird_id",                                null: false
    t.boolean  "local",                  default: false
    t.string   "info_url",                               null: false
    t.string   "xeno_canto_url",                         null: false
    t.string   "recordist"
    t.string   "recording_file_name"
    t.string   "recording_content_type"
    t.integer  "recording_file_size"
    t.datetime "recording_updated_at"
    t.string   "rating"
  end

  create_table "user_regions", force: :cascade do |t|
    t.integer  "user_id",                null: false
    t.integer  "region_id",              null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "xp",         default: 0, null: false
    t.integer  "level",      default: 1, null: false
    t.integer  "xp_day2",    default: 0
    t.integer  "xp_day3",    default: 0
    t.integer  "xp_day4",    default: 0
    t.integer  "xp_day5",    default: 0
    t.integer  "xp_day6",    default: 0
    t.integer  "xp_day7",    default: 0
    t.string   "country",                null: false
    t.string   "state"
    t.string   "county"
  end

  add_index "user_regions", ["user_id"], name: "index_user_regions_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",                                                     null: false
    t.string   "password_digest",                                           null: false
    t.string   "session_token",                                             null: false
    t.string   "alias"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "streak_count",       default: 0,                            null: false
    t.date     "last_quiz_date"
    t.string   "image_file_name"
    t.string   "image_content_type"
    t.integer  "image_file_size"
    t.datetime "image_updated_at"
    t.string   "favorite"
    t.text     "about"
    t.string   "provider"
    t.string   "uid"
    t.string   "time_zone",          default: "Eastern Time (US & Canada)"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["uid"], name: "index_users_on_uid", using: :btree

end
