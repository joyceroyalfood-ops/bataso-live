function sortVipList(list) {
  return [...list].sort((a, b) => b.points - a.points);
}

function addVipPoints(list, nickname, points) {
  const user = list.find((item) => item.nickname === nickname);
  if (user) {
    user.points += points;
    user.badge = user.points >= 5000 ? 'VIP' : 'HOT';
  } else {
    list.push({ nickname, points, badge: 'HOT' });
  }
  return sortVipList(list);
}

export { sortVipList, addVipPoints };
