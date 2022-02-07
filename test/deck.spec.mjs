import Deck from '../src/deck.mjs';
import assert from 'assert';
import Card from '../src/card.mjs';

describe('[Deck] class tests', () => {
  it('initialize from code with invalid value throws exception', () => {
    assert.throws(() => Deck.fromCode('!CEBQCAABAAAQEAABAA'));
  });

  it('must encode empty deck correctly', () => {
    const deck = new Deck([]);
    assert.equal(deck.code, 'CEAAAAA');
  });

  it('must decode empty deck code correctly', () => {
    const deck = Deck.fromCode('CEAAAAA');
    assert.equal(deck.code, 'CEAAAAA');
    assert.equal(deck.cards.length, 0);
  });

  it('add card and validate code', () => {
    const deck = new Deck([]);
    deck.add('01DE001');
    assert.equal(deck.code, 'CEAAAAIBAEAAC');
  });

  it('add duplicated card must throw exception', () => {
    const deck = new Deck([Card.fromCode('01DE001')]);
    assert.throws(() => deck.add('01DE001'));
  });

  it('must initialize deck from example code correctly and encode to correct ordered code', () => {
    const deck = Deck.fromCode('CEAAECABAQJRWHBIFU2DOOYIAEBAMCIMCINCILJZAICACBANE4VCYBABAILR2HRL');
    assert.equal(deck.version, 1);
    assert.equal(deck.cards.length, 24);
    assert.equal(deck.code, 'CEAAECABAIDASDASDISC2OIIAECBGGY4FAWTINZ3AICACAQXDUPCWBABAQGSOKRM');
  });

  it('version 1 encode', () => {
    const deck = new Deck([Card.fromCode('01DE001', 3)]);
    assert.equal(deck.code, 'CEAQCAIAAEAAA');
  });

  it('version 1 decode', () => {
    const deck = Deck.fromCode('CEAQCAIAAEAAA');
    assert.equal(deck.cards.length, 1);
  });

  it('version 2', () => {
    const deck = new Deck([Card.fromCode('01BW001', 3), Card.fromCode('01DE001', 2)]);
    assert.equal(deck.code, 'CIAQCAIGAEAQCAIAAEAA');
  });

  it('version 3', () => {
    const deck = new Deck([Card.fromCode('01MT001', 3), Card.fromCode('01BW001', 2), Card.fromCode('01DE001', 1)]);
    assert.equal(deck.code, 'CMAQCAIJAEAQCAIGAEAQCAIAAE');
  });

  it('version 4', () => {
    const deck = new Deck([Card.fromCode('01BC001', 3)]);
    assert.equal(deck.code, 'CQAQCAIKAEAAA');
  });

  describe('must decode correctly', () => {
    // prettier-ignore
    const decks = [
      {
        code: 'CEBAIAIFB4WDANQIAEAQGDAUDAQSIJZUAIAQCBIFAEAQCBAA',
        cards: ['01SI015:3','01SI044:3','01SI048:3','01SI054:3','01FR003:3','01FR012:3','01FR020:3','01FR024:3','01FR033:3','01FR036:3','01FR039:3',
        '01FR052:3','01SI005:2','01FR004:2'],
      },
      {
        code: 'CEBAEAIBAQTQMAIAAILSQLBNGUBACAIBFYDACAAHBEHR2IBLAEBACAIFAY',
        cards: ['01FR004:3','01FR039:3','01DE002:3','01DE023:3','01DE040:3','01DE044:3','01DE045:3','01DE053:3','01FR046:2','01DE007:2','01DE009:2',
        '01DE015:2','01DE029:2','01DE032:2','01DE043:2','01FR005:1','01FR006:1'],
      },
      {
        code: 'CEBAIAIABEQDINIFAEBAUEATEAYAEAIBAIYQGAIAAIDSUAQCAEBCWLIDAEAAMHJN',
        cards: ['01DE009:3','01DE032:3','01DE052:3','01DE053:3','01IO010:3','01IO016:3','01IO019:3','01IO032:3','01IO048:3','01IO049:2','01DE002:2',
        '01DE007:2','01DE042:2','01IO043:1','01IO045:1','01DE006:1','01DE029:1','01DE045:1'],
      },
      {
        code: 'CEBAMAIDBQISMKROGEDACAACBEKR2MZVAIAQCAATAEAQGBAA',
        cards: ['01NX012:3','01NX017:3','01NX038:3','01NX042:3','01NX046:3','01NX049:3','01DE002:3','01DE009:3','01DE021:3','01DE029:3','01DE051:3',
        '01DE053:3','01DE019:2','01NX004:2'],
      },
      {
        code: 'CEBAIAIAC4QSUMAHAECAIHZMGEZTIOABAIAQIDQYAEBQCAAHEAZA',
        cards: ['01DE023:3','01DE033:3','01DE042:3','01DE048:3','01PZ004:3','01PZ031:3','01PZ044:3','01PZ049:3','01PZ051:3','01PZ052:3','01PZ056:3',
        '01PZ014:2','01PZ024:2','01DE007:1','01DE032:1','01DE050:1'],
      },
      {
        code: 'CEBAEAIACYLQQAIFAEFQ6HRDFMWDMAQBAECTCAYBAABA6IICAEAQKLIBAEAAO',
        cards: ['01DE022:3','01DE023:3','01SI001:3','01SI011:3','01SI015:3','01SI030:3','01SI035:3','01SI043:3','01SI044:3','01SI054:3','01SI049:2',
        '01DE002:2','01DE015:2','01DE033:2','01SI045:1','01DE007:1'],
      },
      {
        code: 'CEBAIAIBCQMCCJAHAECAIHZEFQYTGNACAEAQCNACAECBWIYBAEAQCAY',
        cards: ['01FR020:3','01FR024:3','01FR033:3','01FR036:3','01PZ004:3','01PZ031:3','01PZ036:3','01PZ044:3','01PZ049:3','01PZ051:3','01PZ052:3',
        '01FR052:2','01PZ027:2','01PZ035:2','01FR003:1'],
      },
      {
        code: 'CEBAMAICAQFR6KJLGUDQCAIMCIKBMIJHF4AACAIBAELQ',
        cards: ['01IO004:3','01IO011:3','01IO031:3','01IO041:3','01IO043:3','01IO053:3','01FR012:3','01FR018:3','01FR020:3','01FR022:3','01FR033:3',
        '01FR039:3','01FR047:3','01FR023:1'],
      },
      {
        code: 'CEBAIAIDAQDB2HQHAEAQICIUCUQS2LQBAIAQGCZVAIAQCAIDAIAQGIBE',
        cards: ['01NX004:3','01NX006:3','01NX029:3','01NX030:3','01FR004:3','01FR009:3','01FR020:3','01FR021:3','01FR033:3','01FR045:3','01FR046:3',
        '01NX011:2','01NX053:2','01FR003:1','01NX032:1','01NX036:1'],
      },
      {
        code: 'CEBAKAICAYEASDYQAYAQGBAKB4SC4MIBAIAQEDBBAEBQCAQCBIYQ',
        cards: ['01IO006:3','01IO008:3','01IO009:3','01IO015:3','01IO016:3','01NX004:3','01NX010:3','01NX015:3','01NX036:3','01NX046:3','01NX049:3',
        '01IO012:2','01IO033:2','01IO002:1','01IO010:1','01IO049:1'],
      },
      {
        code: 'CEBAIAIEAQESINAIAEBAMCIMCEKSULBQAIAQCAQLAEAQIAQA',
        cards: ['01PZ004:3','01PZ009:3','01PZ036:3','01PZ052:3','01IO006:3','01IO009:3','01IO012:3','01IO017:3','01IO021:3','01IO042:3','01IO044:3',
        '01IO048:3','01IO011:2','01PZ002:2'],
      },
      {
        code: 'CEBAKAIFAEKRMHZKAYAQEAYGA4ERWKQBAMAQKBI5EYAQCAIFFQ',
        cards: ['01SI001:3','01SI021:3','01SI022:3','01SI031:3','01SI042:3','01IO003:3','01IO006:3','01IO007:3','01IO009:3','01IO027:3','01IO042:3',
        '01SI005:2','01SI029:2','01SI038:2','01SI044:1'],
      },
      {
        code: 'CEBAGAIDCQTTCCABAQAQYEQ4EYUC2NACAEAQGBACAECAIDIBAEAQIBI',
        cards: ['01NX020:3','01NX039:3','01NX049:3','01PZ001:3','01PZ012:3','01PZ018:3','01PZ028:3','01PZ038:3','01PZ040:3','01PZ045:3','01PZ052:3',
        '01NX004:2','01PZ004:2','01PZ013:2','01PZ005:1'],
      },
      {
        code: 'CEBAKAIDBUHROGZOAYAQKAJEE4VTENIBAIAQGFRGAIAQCAYUAIAQKFBR',
        cards: ['01NX013:3','01NX015:3','01NX023:3','01NX027:3','01NX046:3','01SI001:3','01SI036:3','01SI039:3','01SI043:3','01SI050:3','01SI053:3',
        '01NX022:2','01NX038:2','01NX020:1','01SI020:1','01SI049:1'],
      },
      {
        code: 'CEBAGAIFB43DOCABAQCB6JBMGEZTIOACAEAQKAICAECAMGYBAEAQKAY',
        cards: ['01SI015:3','01SI054:3','01SI055:3','01PZ004:3','01PZ031:3','01PZ036:3','01PZ044:3','01PZ049:3','01PZ051:3','01PZ052:3','01PZ056:3','01SI001:2',
        '01PZ006:2','01PZ027:2','01SI003:1'],
      },
      {
        code: 'CEAQUAIAAEBAYFA2EERCIJZNAECACAAHEAZDGAICAEAAGDQ',
        cards: ['01DE001:3','01DE002:3','01DE012:3','01DE020:3','01DE026:3','01DE033:3','01DE034:3','01DE036:3','01DE039:3','01DE045:3','01DE007:2','01DE032:2',
        '01DE050:2','01DE051:2','01DE003:1','01DE014:1'],
      },
      {
        code: 'CEAQYAIBAEFREEYUDAPCCJJGFIYACAQBAEUDIAA',
        cards: ['01FR001:3','01FR011:3','01FR018:3','01FR019:3','01FR020:3','01FR024:3','01FR030:3','01FR033:3','01FR037:3','01FR038:3','01FR042:3','01FR048:3',
        '01FR040:2','01FR052:2'],
      },
      {
        code: 'CEAQWAICBEFQYEARCUSCULBQGIAQGAICAIDB2AIBAEBBI',
        cards: ['01IO009:3','01IO011:3','01IO012:3','01IO016:3','01IO017:3','01IO021:3','01IO036:3','01IO042:3','01IO044:3','01IO048:3','01IO050:3','01IO002:2',
        '01IO006:2','01IO029:2','01IO020:1'],
      },
      {
        code: 'CEAQSAIDBAGA4EA2D4QSMNIBAUAQGBARDAUSWAIDAEBQWJBK',
        cards: ['01NX008:3','01NX012:3','01NX014:3','01NX016:3','01NX026:3','01NX031:3','01NX033:3','01NX038:3','01NX053:3','01NX004:2','01NX017:2','01NX024:2',
        '01NX041:2','01NX043:2','01NX011:1','01NX036:1','01NX042:1'],
      },
      {
        code: 'CEAQ2AIEAQEASCQSDEPSEJBMGM2DKAABAEAQIGY',
        cards: ['01PZ004:3','01PZ008:3','01PZ009:3','01PZ010:3','01PZ018:3','01PZ025:3','01PZ031:3','01PZ034:3','01PZ036:3','01PZ044:3','01PZ051:3','01PZ052:3',
        '01PZ053:3','01PZ027:1'],
      },
      {
        code: 'CEAQSAIFBMHREHRAFEVCWMABAYAQKAIUDURSYLIBAEAQKGQ',
        cards: ['01SI011:3','01SI015:3','01SI018:3','01SI030:3','01SI032:3','01SI041:3','01SI042:3','01SI043:3','01SI048:3','01SI001:2','01SI020:2','01SI029:2',
        '01SI035:2','01SI044:2','01SI045:2','01SI026:1'],
      },
      {
        code: 'CMAQCBAHBIAQCBAHAMAAIAQAAICQGBQE',
        cards: ['04SH010:3','04SH003:2','02DE002:4','03BW004:5'],
      },
      {
        code: 'CQAQEAIKBIKAAAA',
        cards: ['01BC010:3','01BC020:3'],
      },
    ];

    decks.forEach(({code, cards}) => {
      it(`from code ${code}`, () => {
        const deck = Deck.fromCode(code);
        assert.deepEqual(deck.list, cards);
      });
    });
  });

  describe('order of cards does not matter to get same valid code', () => {
    // prettier-ignore
    const decks = [
      {
        code: 'CEAQSAIFBMHREHRAFEVCWMABAYAQKAIUDURSYLIBAEAQKGQ',
        cards: ['01SI011:3','01SI035:2','01SI044:2','01SI045:2','01SI026:1','01SI015:3','01SI018:3','01SI030:3','01SI032:3','01SI041:3','01SI042:3','01SI043:3','01SI048:3','01SI001:2',
        '01SI020:2','01SI029:2'],
      },
      {
        code: 'CIAQCBAHBIAQCBAHAMAAIAQAAICQGBQE',
        cards: ['04SH010:3','04SH003:2','02DE002:4','03BW004:5'],
      },
      {
        code: 'CQAQEAIKBIKAAAA',
        cards: ['01BC020:3','01BC010:3'],
      },
    ];

    decks.forEach(({code, cards}) => {
      cards.sort();
      it(`must encode correct with sorted cards [${cards.join(';')}]`, () => {
        const deck = Deck.fromCardCodes(cards);
        assert.equal(deck.code, code, deck.list.join(';'));
      });
    });

    decks.forEach(({code, cards}) => {
      cards.sort(() => (Math.random() >= .5) ? 1 : -1);
      it(`must encode correct with shuffled cards [${cards.join(';')}]`, () => {
        const deck = Deck.fromCardCodes(cards);
        assert.equal(deck.code, code, deck.list.join(';'));
      });
    });
  });
});
