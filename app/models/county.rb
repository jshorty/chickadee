class County < ActiveRecord::Base
  validates :name, presence: true, uniqueness: {scope: :state}
  validates :code, presence: true, uniqueness: true

end
