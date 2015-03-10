class County < ActiveRecord::Base
  validates :name, :code, :country, presence: true, uniqueness: true

end
