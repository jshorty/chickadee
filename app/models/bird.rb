class Bird < ActiveRecord::Base
  validates :common_name, :sci_name, presence: true, uniqueness: true

  def genus
    self.sci_name.split(" ")[0]
  end

  def species
    self.sci_name.split(" ")[1]
  end

  def subspecies
    names = self.sci_name.split(" ")
    names.length > 2 ? names[2] : nil
  end
end
