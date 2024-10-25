import React from 'react';
import { Badge } from '@rneui/themed';
import { styles } from '@/styles/app-styles';

export const handleMenuItemMatches = (matches: number) => {
  if (matches == 0) { // handle if the match is ever 0
    return 'NO MATCHES';
  } else if (matches < 8) {
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
    return colorMap[matchScore] || ['#F5F5F5', '#E6D7FA']; // default menu item matches is NO MATCHES if no menu items returned
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
        borderWidth: 1,
      }}
      value={matchScore}
      textStyle={[
        styles.badgeText, 
        { color: matchScore == "NO MATCHES" ? '#CAC4D0' : 'white' }
      ]}
    />
  );
};

export default MenuItemBadge;
