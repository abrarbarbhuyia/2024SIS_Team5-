import React from 'react';
import { Badge } from '@rneui/themed';
import { styles } from '@/styles/app-styles';

export const handleMenuItemMatches = (matches: number) => {
  if (matches < 8) {
    return 'MEH';
  } else if (matches >= 8 && matches < 15) {
    return 'OKAY';
  } else {
    return 'PERFECT';
  }
};

const MenuItemBadge = ({ matches }: { matches: number }) => {
  const handleBadgeColor = (matchScore: string) => {
    const colorMap: Record<string, string[]> = {
      MEH: ['#EC6C43', '#D98522'],
      OKAY: ['#F2E90F', '#D3CC12'],
      PERFECT: ['#16D59C', '#14BB89'],
    };
    return colorMap[matchScore] || ['#16D59C', '#14BB89']; // default menu item matches is PERFECT when no filters are applied
  };

  const matchScore = handleMenuItemMatches(matches);
  const badgeColors = handleBadgeColor(matchScore);

  return (
    <Badge
      badgeStyle={{
        backgroundColor: badgeColors[0],
        height: 22,
        marginTop: -2,
        paddingHorizontal: 6,
        borderStyle: 'solid',
        borderColor: badgeColors[1],
      }}
      value={matchScore}
      textStyle={styles.badgeText}
    />
  );
};

export default MenuItemBadge;
