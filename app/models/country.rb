class Country < ActiveRecord::Base
  validates :name, :code, presence: true, uniqueness: true

end
