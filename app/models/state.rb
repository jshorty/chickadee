class State < ActiveRecord::Base
  validates :name, presence: true
  validates :code, presence: true, uniqueness: true
end
