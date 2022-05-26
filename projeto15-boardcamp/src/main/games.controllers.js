export function validateGameBody(req, res, next) { }

const games = [
    {
        id: 1,
        name: 'Banco Imobiliário',
        image: 'http://',
        stockTotal: 3,
        categoryId: 1,
        pricePerDay: 1500,
        categoryName: 'Estratégia'
    },
    {
        id: 2,
        name: 'Detetive',
        image: 'http://',
        stockTotal: 1,
        categoryId: 2,
        pricePerDay: 2500,
        categoryName: 'Investigação'
    }
]

export function getGames(req, res) { res.send(games) }
export function postGame(req, res) { }
