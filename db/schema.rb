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

ActiveRecord::Schema.define(version: 20150626215122) do

  create_table "answers", force: :cascade do |t|
    t.string   "answer",      limit: 255
    t.integer  "question_id", limit: 4
    t.boolean  "right_flag",  limit: 1
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  create_table "questions", force: :cascade do |t|
    t.string   "question",      limit: 255
    t.integer  "answer_type",   limit: 1
    t.string   "right_answer",  limit: 255
    t.text     "short_comment", limit: 65535
    t.text     "description",   limit: 65535
    t.integer  "theme_id",      limit: 4
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.integer  "category",      limit: 1
  end

  create_table "questions_themes", force: :cascade do |t|
    t.string "theme",       limit: 255
    t.string "description", limit: 255
  end

end
