class User < ActiveRecord::Base
  validates :email, :password_digest, :session_token, presence: true
  validates :email, :session_token, uniqueness: true
  validates :password, length: {minimum: 8}
  validate :email_must_have_valid_format
  after_initialize :ensure_session_token

  def email_must_have_valid_format
    unless this.email.match(/[\w|\-|\.]+@[\w|\-]+\.\w+/)
      errors.add(:email, "must be a valid email address")
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
    self.session_token ||= reset_session_token!
  end

  def reset_session_token!
    self.update(session_token: User.generate_token)
    self.session_token
  end

  def self.generate_token
    SecureRandom::urlsafe_base64
  end

end
