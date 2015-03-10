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

ActiveRecord::Schema.define(version: 20150310220357) do

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
    t.string   "common_name", null: false
    t.string   "sci_name",    null: false
    t.string   "song_desc"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "birds", ["common_name"], name: "index_birds_on_common_name", unique: true, using: :btree
  add_index "birds", ["sci_name"], name: "index_birds_on_sci_name", unique: true, using: :btree

  create_table "counties", force: :cascade do |t|
    t.string "code",    null: false
    t.string "name",    null: false
    t.string "state",   null: false
    t.string "country", null: false
  end

  add_index "counties", ["code"], name: "index_counties_on_code", using: :btree
  add_index "counties", ["name"], name: "index_counties_on_name", using: :btree

  create_table "countries", force: :cascade do |t|
    t.string "code", null: false
    t.string "name", null: false
  end

  add_index "countries", ["code"], name: "index_countries_on_code", using: :btree
  add_index "countries", ["name"], name: "index_countries_on_name", using: :btree

  create_table "regions", force: :cascade do |t|
    t.string   "county"
    t.string   "state"
    t.string   "country",    null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "states", force: :cascade do |t|
    t.string "code",    null: false
    t.string "name",    null: false
    t.string "country", null: false
  end

  add_index "states", ["code"], name: "index_states_on_code", using: :btree
  add_index "states", ["name"], name: "index_states_on_name", using: :btree

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
