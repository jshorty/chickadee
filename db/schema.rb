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

ActiveRecord::Schema.define(version: 20150312180228) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "bird_regions", force: :cascade do |t|
    t.integer  "region_id",  null: false
    t.integer  "bird_id",    null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "bird_regions", ["region_id"], name: "index_bird_regions_on_region_id", using: :btree

  create_table "birds", force: :cascade do |t|
    t.string "common_name", null: false
    t.string "sci_name",    null: false
    t.string "song_desc"
  end

  add_index "birds", ["common_name"], name: "index_birds_on_common_name", unique: true, using: :btree
  add_index "birds", ["sci_name"], name: "index_birds_on_sci_name", unique: true, using: :btree

  create_table "quizzes", force: :cascade do |t|
    t.integer  "user_id",                null: false
    t.integer  "region_id",              null: false
    t.integer  "progress",   default: 0, null: false
    t.integer  "score",      default: 0, null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "quizzes", ["progress"], name: "index_quizzes_on_progress", using: :btree
  add_index "quizzes", ["user_id"], name: "index_quizzes_on_user_id", using: :btree

  create_table "regions", force: :cascade do |t|
    t.string   "county"
    t.string   "state"
    t.string   "country",    null: false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "code",       null: false
  end

  create_table "user_regions", force: :cascade do |t|
    t.integer  "user_id",    null: false
    t.integer  "region_id",  null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_regions", ["user_id"], name: "index_user_regions_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email",           null: false
    t.string   "password_digest", null: false
    t.string   "session_token",   null: false
    t.string   "alias"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree

end
