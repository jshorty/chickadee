class User < ActiveRecord::Base
  validates :email, :password_digest, :session_token, presence: true
  validates :email, :session_token, uniqueness: true
  validates :password, length: { minimum: 8, allow_nil: true }
  validate :email_must_have_valid_format
  after_initialize :ensure_session_token
  before_save :set_last_quiz_date

  has_many :user_regions,
    class_name: "UserRegion",
    primary_key: :id,
    foreign_key: :user_id,
    dependent: :destroy

  has_many :quizzes,
    class_name: "Quiz",
    primary_key: :id,
    foreign_key: :user_id,
    dependent: :destroy

  has_many :user_birds

  has_many :regions, through: :user_regions, source: :region
  has_many :birds, through: :regions, source: :birds
  has_many :bird_regions, through: :birds, source: :bird_regions

  has_attached_file :image,
  default_url: "https://s3.amazonaws.com/chickadee-production/images/bird_photos/sparrow_icon.png",
  :styles => {medium: "150x150#", thumb: "50x50#"}
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  def self.find_or_create_by_auth_hash(auth_hash)
    user = User.find_by(
            provider: auth_hash[:provider],
            uid: auth_hash[:uid])
    unless user
      user = User.create!(
            provider: auth_hash[:provider],
            uid: auth_hash[:uid],
            alias: auth_hash[:info][:name],
            email: auth_hash[:info][:email],
            password: SecureRandom::urlsafe_base64)
    end
    user
  end

  def email_must_have_valid_format
    if self.email
      if self.email.match(" ")
        errors.add(:email, "must be a valid email address")
      end
      unless self.email.match(/[\w|\-|\.]+@[\w|\-]+\.\w+/)
        errors.add(:email, "must be a valid email address")
      end
    end
  end

  def password
    @password
  end

  def password=(password)
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end

  def self.find_by_credentials(email, password)
    user = User.find_by(email: email)
    user && user.is_password?(password) ? user : nil
  end

  def ensure_session_token
    self.session_token ||= User.generate_token
  end

  def reset_session_token!
    self.session_token = User.generate_token
    self.save!
    self.session_token
  end

  def self.generate_token
    SecureRandom::urlsafe_base64
  end

  def check_for_streak
    today = Date.today.in_time_zone(self.time_zone).to_date
    if !self.last_quiz_date || today - 1 > self.last_quiz_date
      self.update!({streak_count: 0})
    end
  end

  def continue_streak
    unless self.completed_quiz_today?
      today = Date.today.in_time_zone(self.time_zone).to_date
      self.update!(streak_count: self.streak_count += 1, last_quiz_date: today)
    end
  end

  def gain_xp(region, xp)
    user_region = self.user_regions.find_by_region_id(region.id)
    user_region.gain_xp(xp)
  end

  def completed_quiz_today?
    self.last_quiz_date == 0.days.ago.in_time_zone(self.time_zone).to_date
  end

  def set_last_quiz_date #Rails doesn't support dynamic default values in migrations
    self.last_quiz_date ||= Date.today if self.new_record?
  end
end
