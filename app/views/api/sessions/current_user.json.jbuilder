json.(current_user, :id, :email, :alias, :streak_count)

json.image_url_medium current_user.image.url(:medium)
json.image_url_thumb current_user.image.url(:thumb)
