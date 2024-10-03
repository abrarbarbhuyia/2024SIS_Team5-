import { Dimensions, StyleSheet } from "react-native";

const {width, height} = Dimensions.get('window');

const colours = {
  textPrimary: '#1D1B20',
  white: '#FFFFFF',
  red: '#CB4C4E',
  // Blues
  highlight: '#0B84FF',
  border: '#484DBE',
  // Purples
  primary: '#5A428F',
  secondary: '#FBF8FF',
  textSecondary: '#49454F',
  purple: '#720BC4',
  lightPurple: '#79747E',
  darkPurple: '#281554',
  midPurple: '#534072',
  filterBorder: '#79747E',
  labelColor: '#7E7093',
  tertiary: '#E6D7FA',
  // Greys
  lightIconGrey: '#BCBCBC',
  mutedGrey: '#888',
  borderGrey: '#EEE',
  grey: '#808080',
  lightGrey: '#CCCCCC',
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colours.tertiary,
  },
  rectangle: {
    width: '90%',
    paddingVertical: 20,
    backgroundColor: colours.secondary,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 2,
    shadowRadius: 4,
  },
  logo: {
    width: 124,
    height: 59,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 15,
    alignSelf: 'center'
  },
  subtitle: {
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 32,
    color: colours.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  supportingText: {
    paddingBottom: 8,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: colours.textSecondary,
    marginBottom: 30,
    alignSelf: 'center',
  },
  supportingTextHome: {
    paddingBottom: 8,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    color: colours.textSecondary,
    alignSelf: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
    position: 'relative',
  },
  input: {
    width: 250,
    height: 40,
    borderColor: colours.lightGrey,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: colours.white,
    paddingHorizontal: 40,
    fontSize: 16,
    color: colours.grey,
  },
  icon: {
    position: 'absolute',
    left: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
  },
  button: {
    marginTop: 15,
    marginBottom: 10,
    minWidth: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.primary,
    borderColor: colours.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 7,
    alignSelf: 'center'
  },
  label: {
    position: 'absolute',
    left: 10,
    backgroundColor: 'transparent',
    top: -18,
    fontSize: 12,
    color: colours.labelColor,
    fontWeight: '600',
  },
  buttonText: {
    color: colours.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    textDecorationLine: 'underline',
    color: colours.primary,
  },
  signUpButton: {
    marginBottom: 15,
    minWidth: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colours.secondary,
    borderColor: colours.primary,
    borderWidth: 2,
    borderRadius: 20,
    padding: 7,
    alignSelf: 'center',
  },
  signUpButtonText: {
    color: colours.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  guestText: {
    paddingTop: 6,
    color: colours.purple,
    textAlign: 'center',
  },
  finderCard: {
    width: width - 32,
    height: 200,
    backgroundColor: colours.secondary,
    padding: 12,
    borderRadius: 24,
    marginTop: 5,
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 2,
    shadowRadius: 4,
    justifyContent: "space-between",
    marginBottom: 5,
  },
  recentCard: {
    width: width - 32,
    height: 220,
    backgroundColor: colours.secondary,
    padding: 12,
    borderRadius: 24,
    marginTop: 5,
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 2,
    shadowRadius: 4,
    justifyContent: "space-between",
    marginBottom: 5,
  },
  recommendationsCard: {
    width: width - 32,
    height: 265,
    backgroundColor: colours.secondary,
    padding: 12,
    borderRadius: 24,
    marginTop: 5,
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 2,
    shadowRadius: 4,
    justifyContent: "space-between",
    marginBottom: 5,
  },
  carousel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  imageContainer: {
    marginRight: 10,
    backgroundColor: colours.white,
    borderRadius: 8,
    overflow: 'hidden',
    width: 120,
    height: 150,
  },
  homeImage: {
    width: '100%',
    height: 100,
  },
  recentLabel: {
    marginLeft: 5,
    marginTop: 5,
  },
  recentComment: {
    marginLeft: 5,
    fontSize: 12,
    opacity: 0.5,
  },
  filledCircle: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderRadius: 12.5, 
    borderStyle:'solid',
    borderWidth: 3,
    borderColor: colours.white,
    backgroundColor: colours.highlight,
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 2,
    shadowRadius: 4,
  },
  map: {
    minWidth: 300,
    width: '100%',
    height: '57%',
    borderRadius: 15
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  baseCard: {
    maxHeight: height-160,
    maxWidth:width+2,
    backgroundColor: colours.secondary,
    borderRadius: 24,
    marginTop: 5,
    elevation: 4,
    paddingHorizontal: 0,
    justifyContent: "space-between",
    marginBottom: 5,
  },
  filterBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  flexContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    height: 20,
    minHeight: 30,
    width: '100%',
    paddingHorizontal: 10
  },
  typesBackground: {
    backgroundColor: colours.secondary,
    height: 28,
    paddingLeft: 4,
    paddingRight: 4,
    borderStyle: 'solid',
    borderColor: colours.lightPurple,
  },
  typesText: {
    color: colours.darkPurple,
    fontWeight: '400',
    fontSize: 11,
    letterSpacing: -0.4,
  },
  filterCheck: {
    color: colours.midPurple,
    marginRight: 5,
  },
  filterBackground: {
    backgroundColor: colours.secondary,
    height: 22,
    paddingHorizontal: 4,
    borderStyle: 'solid',
    borderColor: colours.filterBorder,
  },
  filterText: {
    color: colours.darkPurple,
    fontWeight: '300',
    fontSize: 11,
    textAlign: 'center',
  },
  badgesCross: {
    color: colours.lightIconGrey,
    paddingLeft: 4,
    height: 12,
    width: 20,
  },
  card: {
    backgroundColor: colours.secondary,
    padding: 20,
    borderRadius: 20,
  },
  mapIcon: {
    color: colours.midPurple,
    paddingHorizontal: 8,
  },
  badgeScrollView: {
    flexDirection: 'row',
    gap: 4,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  innerIcon: {
    position: 'absolute',
  },
  innerCircle: {
    position: 'absolute', 
    backgroundColor: colours.red,
    borderRadius: 20, 
    width: 20,
    height: 25, 
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateY: -5 }]
  },
  noResultsText: { 
    textAlign: 'center', 
    color: colours.mutedGrey, 
    marginTop: 20 
  },
  restaurantItem: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: colours.borderGrey,
  },
  restaurantName: { 
    fontSize: 18 
  },
  pageContainer: {
    padding: 15,
    justifyContent: 'space-between', 
  },
  textDetail: {
      paddingBottom: 25,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
  },
  ratingsView: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  contactCard: {
      paddingTop: 20,
  },
  contactInformation: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 10,
      paddingRight: 10,
  },
  body: {
      fontSize: 12,
  },
  galleryImageContainer: {
      marginRight: 10,
      backgroundColor: 'white',
      borderRadius: 8,
      overflow: 'hidden',
      width: 180,
      height: 180,
  },
  image: {
      width: '100%',
      height: '100%'
  },
  modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalBackground: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
  },
  fullImage: {
      width: '90%',
      height: '70%',
      resizeMode: 'contain',
  },
});
