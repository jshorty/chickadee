class User < ActiveRecord::Base
  validates :email, :password_digest, :session_token, presence: true
  validates :email, :session_token, uniqueness: true
  validates :password, length: { minimum: 8, allow_nil: true }
  validate :email_must_have_valid_format
  after_initialize :ensure_session_token

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

  has_many :regions, through: :user_regions, source: :region
  has_many :birds, through: :regions, source: :birds

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
    if Date.today - 1 > self.last_quiz_date
      self.update!({streak_count: 0})
    end
  end

  def continue_streak
    return if Date.today == self.last_quiz_date

    self.update!(streak_count: self.streak_count += 1,
                 last_quiz_date: Date.today)
  end
end
