import { addDocument, fetchDocuments } from '../handlers/NutritionHandler';
import diacritics from 'diacritics';
const removeDiacritics = diacritics.remove; // Adjust for how the library exports its functions

export const getFoodImage = (aliment, categorieAlimente, categoryImageMap) => {
  if (!aliment && !categorieAlimente) return categoryImageMap.default; // Default image if both are undefined

  // Normalize and tokenize search terms
  const searchTerms = removeDiacritics(`${aliment} ${categorieAlimente}`).toLowerCase().split(/\s+/);

  const categoryMappings = [
    { keywords: ['watermelon', 'pepene verde', 'pepene rosu', 'lubenita'], image: categoryImageMap.watermelon },
    { keywords: ['almond', 'almonds', 'migdale', 'alune'], image: categoryImageMap.almond },
    { keywords: ['apple', 'apples', 'mere', 'măr'], image: categoryImageMap.apple },
    { keywords: ['apple juice', 'suc de mere'], image: categoryImageMap.apple_juice },
    { keywords: ['avocado', 'avocados'], image: categoryImageMap.avocado },
    { keywords: ['bacon'], image: categoryImageMap.bacon },
    { keywords: ['bagel'], image: categoryImageMap.bagel },
    { keywords: ['banana', 'bananas', 'banane'], image: categoryImageMap.banana },
    { keywords: ['barley', 'orz'], image: categoryImageMap.barley },
    { keywords: ['beef', 'vacă', 'vită', 'carne de vită'], image: categoryImageMap.beef },
    { keywords: ['beetroot', 'beet', 'sfeclă', 'sfeclă roșie'], image: categoryImageMap.beetroot },
    { keywords: ['blueberry', 'blueberries', 'afine'], image: categoryImageMap.blueberry },
    { keywords: ['bread', 'loaf', 'buns', 'pâine', 'franzelă', 'chifle', 'baghetă'], image: categoryImageMap.bread },
    { keywords: ['broccoli'], image: categoryImageMap.broccoli },
    { keywords: ['cake', 'tort', 'prăjitură', 'cheesecake', 'tartă'], image: categoryImageMap.cake },
    { keywords: ['candy cane', 'baston de bomboane'], image: categoryImageMap.candy_cane },
    { keywords: ['carrot', 'carrots', 'morcov', 'morcovi'], image: categoryImageMap.carrot },
    { keywords: ['cereals', 'cereal', 'cereale'], image: categoryImageMap.cereals },
    { keywords: ['cheese', 'brânză', 'cașcaval', 'mozzarella', 'parmezan', 'telemea'], image: categoryImageMap.cheese },
    { keywords: ['cherry', 'cherries', 'cireșe', 'vișine', 'cireș'], image: categoryImageMap.cherries },
    { keywords: ['chicken breast', 'piept de pui', 'pui', 'carne de pui'], image: categoryImageMap.chicken_breast },
    { keywords: ['chocolate', 'ciocolată'], image: categoryImageMap.chocolate },
    { keywords: ['coconut', 'nucă de cocos'], image: categoryImageMap.coconut },
    { keywords: ['coffee', 'cafea', 'espresso', 'latte', 'cappuccino'], image: categoryImageMap.coffee },
    { keywords: ['corn', 'maize', 'porumb', 'mălai'], image: categoryImageMap.corn },
    { keywords: ['croissant'], image: categoryImageMap.croissant },
    { keywords: ['eggplant', 'aubergine', 'vinete'], image: categoryImageMap.eggplant },
    { keywords: ['egg', 'eggs', 'ouă', 'ou', 'ouă fierte', 'omletă'], image: categoryImageMap.eggs },
    { keywords: ['fish', 'pește', 'somon', 'ton', 'macrou', 'hering'], image: categoryImageMap.fish },
    { keywords: ['flour', 'făină'], image: categoryImageMap.flour },
    { keywords: ['french fries', 'fries', 'cartofi prajiti', 'cartofi pai'], image: categoryImageMap.french_fries },
    { keywords: ['fried egg', 'oua'], image: categoryImageMap.fried_egg },
    { keywords: ['fruit', 'fructe', 'fruct'], image: categoryImageMap.fruit },
    { keywords: ['garlic', 'usturoi'], image: categoryImageMap.garlic },
    { keywords: ['gingerbread', 'turta dulce'], image: categoryImageMap.gingerbread },
    { keywords: ['grape', 'grapes', 'struguri', 'strugure'], image: categoryImageMap.grapes },
    { keywords: ['hamburger', 'burger', 'hamburgher'], image: categoryImageMap.hamburger },
    { keywords: ['honey', 'miere'], image: categoryImageMap.honey },
    { keywords: ['hot dog', 'sausage', 'cârnați', 'cârnăciori'], image: categoryImageMap.hot_dog },
    { keywords: ['ice cream', 'înghețată'], image: categoryImageMap.ice_cream },
    { keywords: ['kiwi'], image: categoryImageMap.kiwi },
    { keywords: ['lamb', 'miel', 'carne de miel'], image: categoryImageMap.lamb },
    { keywords: ['lettuce', 'salată', 'salată verde'], image: categoryImageMap.lettuce },
    { keywords: ['lime', 'lămâie verde'], image: categoryImageMap.lime },
    { keywords: ['mango', 'mangos', 'mangoes'], image: categoryImageMap.mango },
    { keywords: ['meatball', 'meatballs', 'chiftele', 'perișoare'], image: categoryImageMap.meatballs },
    { keywords: ['milk', 'lapte'], image: categoryImageMap.milk },
    { keywords: ['milkshake'], image: categoryImageMap.milkshake },
    { keywords: ['minced meat', 'ground meat', 'carne tocată'], image: categoryImageMap['minced-meat'] },
    { keywords: ['muffin'], image: categoryImageMap.muffin },
    { keywords: ['nuts', 'nuci', 'alune', 'migdale'], image: categoryImageMap.nuts },
    { keywords: ['oats', 'ovăz'], image: categoryImageMap.oats },
    { keywords: ['olive', 'olives', 'măsline'], image: categoryImageMap.olives },
    { keywords: ['onion', 'onions', 'ceapă'], image: categoryImageMap.onions },
    { keywords: ['orange', 'oranges', 'portocale', 'portocală'], image: categoryImageMap.orange },
    { keywords: ['orange juice', 'suc de portocale'], image: categoryImageMap.orange_juice },
    { keywords: ['pancake', 'clătite'], image: categoryImageMap.pancake },
    { keywords: ['pancakes', 'clătite'], image: categoryImageMap.pancakes },
    { keywords: ['papaya'], image: categoryImageMap.papaya },
    { keywords: ['pasta', 'paste', 'spaghetti', 'macaroni'], image: categoryImageMap.pasta },
    { keywords: ['peach', 'peaches', 'piersică', 'piersici'], image: categoryImageMap.peach },
    { keywords: ['peanut', 'peanuts', 'arahide', 'alune de pământ'], image: categoryImageMap.peanuts },
    { keywords: ['pear', 'pears', 'pere'], image: categoryImageMap.pears },
    { keywords: ['pea', 'peas', 'mazăre'], image: categoryImageMap.peas },
    { keywords: ['pineapple', 'pineapples', 'ananas'], image: categoryImageMap.pineapple },
    { keywords: ['pizza'], image: categoryImageMap.pizza },
    { keywords: ['popcorn'], image: categoryImageMap.popcorn },
    { keywords: ['potato', 'potatoes', 'cartofi', 'cartof'], image: categoryImageMap.potato },
    { keywords: ['potato chips', 'chips', 'chipsuri'], image: categoryImageMap.potato_chips },
    { keywords: ['pumpkin', 'dovleac'], image: categoryImageMap.pumpkin },
    { keywords: ['quinoa'], image: categoryImageMap.quinoa },
    { keywords: ['radish', 'radishes', 'ridichi', 'ridiche'], image: categoryImageMap.radish },
    { keywords: ['raspberry', 'raspberries', 'zmeură'], image: categoryImageMap.raspberries },
    { keywords: ['rhubarb', 'rubarba'], image: categoryImageMap.rhubarb },
    { keywords: ['rice', 'orez'], image: categoryImageMap.rice },
    { keywords: ['salmon', 'fish', 'somon', 'pește'], image: categoryImageMap.salmon },
    { keywords: ['sausage', 'sausages', 'cârnați'], image: categoryImageMap.sausages },
    { keywords: ['mushroom', 'shrooms', 'ciuperci', 'ciupercă'], image: categoryImageMap.shrooms },
    { keywords: ['spinach', 'spanac'], image: categoryImageMap.spinach },
    { keywords: ['steak', 'friptură', 'biftec'], image: categoryImageMap.steak },
    { keywords: ['strawberry', 'strawberries', 'căpșuni', 'căpșună'], image: categoryImageMap.strawberry },
    { keywords: ['sushi'], image: categoryImageMap.sushi },
    { keywords: ['sweet corn', 'corn', 'porumb dulce'], image: categoryImageMap.sweet_corn },
    { keywords: ['sweet potato', 'sweet potatoes', 'cartof dulce', 'cartofi dulci'], image: categoryImageMap.sweet_potatoes },
    { keywords: ['tomato', 'tomatoes', 'roșii', 'roșie'], image: categoryImageMap.tomatoes },
    { keywords: ['tuna', 'ton'], image: categoryImageMap.tuna },
    { keywords: ['turkey', 'curcan'], image: categoryImageMap.turkey },
    { keywords: ['watermelon', 'pepene verde', 'pepene rosu', 'lubenita'], image: categoryImageMap.watermelon },
    { keywords: ['white bread', 'pâine albă'], image: categoryImageMap.white_bread },
    { keywords: ['yogurt', 'iaurt'], image: categoryImageMap.yogurt },
  ];

  // Iterate over category mappings and find the first match
  for (const mapping of categoryMappings) {
    if (mapping.keywords.some(keyword => searchTerms.includes(keyword))) {
      return mapping.image;
    }
  }

  // Return default image if no match is found
  return categoryImageMap.default;
};

// Mapping categories to images
export const categoryImageMap = {
  almond: require('../../assets/almond.png'),
  apple: require('../../assets/apple.png'),
  apple_juice: require('../../assets/apple_juice.png'),
  avocado: require('../../assets/avocado.png'),
  bacon: require('../../assets/bacon.png'),
  bagel: require('../../assets/bagel.png'),
  banana: require('../../assets/banana.png'),
  barley: require('../../assets/barley.png'),
  beef: require('../../assets/beef.png'),
  beetroot: require('../../assets/beetroor.png'), // Corrected file name
  blueberry: require('../../assets/blueberry.png'),
  bread: require('../../assets/bread.png'),
  broccoli: require('../../assets/brocolli.png'), // Corrected file name
  cake: require('../../assets/cake.png'),
  candy_cane: require('../../assets/candy-cane.png'),
  carrot: require('../../assets/carrot.png'),
  cereals: require('../../assets/cereals.png'),
  cheese: require('../../assets/cheese.png'),
  cherries: require('../../assets/cherries.png'),
  chicken_breast: require('../../assets/chicken-breast.png'),
  chocolate: require('../../assets/chocolate.png'),
  coconut: require('../../assets/coconut.png'),
  coffee: require('../../assets/coffee.png'),
  corn: require('../../assets/corn.png'),
  croissant: require('../../assets/croissant.png'),
  eggplant: require('../../assets/eggplant.png'),
  eggs: require('../../assets/eggs.png'),
  fish: require('../../assets/fish.png'),
  flour: require('../../assets/flour.png'),
  food: require('../../assets/food.png'),
  french_fries: require('../../assets/french_fries.png'),
  fried_egg: require('../../assets/fried-egg.png'),
  fruit: require('../../assets/fruit.png'),
  garlic: require('../../assets/garlic.png'),
  gingerbread: require('../../assets/gingerbread.png'),
  grapes: require('../../assets/grapes.png'),
  hamburger: require('../../assets/hamburger.png'),
  honey: require('../../assets/honey.png'),
  hot_dog: require('../../assets/hot_dog.png'),
  ice_cream: require('../../assets/ice-cream.png'),
  kiwi: require('../../assets/kiwi.png'),  
  lamb: require('../../assets/lamb.png'),
  lettuce: require('../../assets/lettuce.png'),
  lime: require('../../assets/lime.png'),
  loaf: require('../../assets/loaf.png'),
  mango: require('../../assets/mango.png'),
  meatballs: require('../../assets/meatballs.png'),
  milk: require('../../assets/milk.png'),
  milkshake: require('../../assets/milkshake.png'),
  minced_meat: require('../../assets/minced-meat.png'),
  muffin: require('../../assets/muffin.png'),
  nuts: require('../../assets/nuts.png'),
  oats: require('../../assets/oats.png'),
  olives: require('../../assets/olives.png'),
  onions: require('../../assets/onions.png'),
  orange: require('../../assets/orange.png'),
  orange_juice: require('../../assets/orange_juice.png'),
  pancake: require('../../assets/pancake.png'),
  pancakes: require('../../assets/pancakes.png'),
  papaya: require('../../assets/papaya.png'),
  pasta: require('../../assets/pasta.png'),
  peach: require('../../assets/peach.png'),
  peanuts: require('../../assets/peanuts.png'),
  pears: require('../../assets/pears.png'),
  peas: require('../../assets/peas.png'),
  pineapple: require('../../assets/pineapple.png'),
  pizza: require('../../assets/pizza.png'),
  popcorn: require('../../assets/popcorn.png'),
  potato: require('../../assets/potato.png'),
  potato_chips: require('../../assets/potato_chips.png'),
  potatoes: require('../../assets/potatoes.png'),
  pumpkin: require('../../assets/pumpkin.png'),
  quinoa: require('../../assets/quinoa.png'),
  radish: require('../../assets/radish.png'),
  raspberries: require('../../assets/raspberries.png'),
  rhubarb: require('../../assets/rhubarb.png'),
  rice: require('../../assets/rice.png'),
  salad: require('../../assets/salad.png'),
  salmon: require('../../assets/salmon.png'),
  sausages: require('../../assets/sausages.png'),
  shrooms: require('../../assets/shrooms.png'),
  spinach: require('../../assets/spinach.png'),
  steak: require('../../assets/steak.png'),
  strawberry: require('../../assets/strawberry.png'),
  sushi: require('../../assets/sushi.png'),
  sweet_corn: require('../../assets/sweet_corn.png'),
  sweet_potatoes: require('../../assets/sweet_potatoes.png'),
  tomatoes: require('../../assets/tomatoes.png'),
  tuna: require('../../assets/tuna.png'),
  turkey: require('../../assets/turkey.png'),
  watermelon: require('../../assets/watermelon.png'),
  white_bread: require('../../assets/white-bread.png'),
  yogurt: require('../../assets/yogurt.png'),
  default: require('../../assets/food.png'),
};

// Fetch recent foods from Firestore and AsyncStorage
export const fetchRecentFoods = async () => {
  try {
    const localRecentFoods = await AsyncStorage.getItem('recentFoods');
    const parsedLocalRecentFoods = localRecentFooqds ? JSON.parse(localRecentFoods) : [];

    const recentFoodsData = await fetchDocuments('recentFoods', [], ['timestamp', 'desc'], 5);
    const recentFoodsFromFirestore = recentFoodsData.map(item => item.food);

    const combinedRecentFoods = [...new Set([...parsedLocalRecentFoods, ...recentFoodsFromFirestore])].slice(0, 3);
    await AsyncStorage.setItem('recentFoods', JSON.stringify(combinedRecentFoods));

    return combinedRecentFoods;
  } catch (err) {
    console.error("Failed to fetch recent foods:", err);
    throw err;
  }
};