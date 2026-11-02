function sortVipList(list) {
  return [...list].sort((a, b) => b.points - a.points);
}

function addVipPoints(list, nickname, points) {
  const found = list.find((user) => user.nickname === nickname);
  if (found) {
    found.points += points;
    found.badge = found.points > 5000 ? 'VIP' : 'HOT';
  } else {
    list.push({ nickname, points, badge: 'HOT' });
  }
  return sortVipList(list);
}

export { sortVipList, addVipPoints };
