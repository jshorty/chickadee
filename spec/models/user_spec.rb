require 'rails_helper'

RSpec.describe User, type: :model do
  it "requires valid email format" do
    user = User.new(password: "password")
    bad_email1 = "xyzabc"
    bad_email2 = "trickier@.."
    bad_email3 = "@amazon.com"
    good_email = "shouldwork@example.com"

    expect(user.update(email: bad_email1)).to be false
    expect(user.update(email: bad_email2)).to be false
    expect(user.update(email: bad_email3)).to be false
    expect(user.update(email: good_email)).to be true
  end

  it "receives a session token on creation" do
    user = User.new(email: "test@example.com",
                    password: "password")
    user.save!
    expect(user.session_token).not_to be_nil
  end

  it "can be found by login credentials" do
    user = User.new(email: "a@a.com",
                    password: "password")
    user.save!
    expect(User.find_by_credentials("a@a.com", "password")).to eq(user)
  end
end
