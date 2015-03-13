if logged_in?
  json.user do
    json.id @user.id
    json.alias @user.alias
    json.email @user.email
  end

  json.logged_in true
else
  json.logged_in false
end
