json.user do
  json.id @user.id
  json.alias @user.alias
  json.email @user.email
end

json.logged_in !!@user.id
