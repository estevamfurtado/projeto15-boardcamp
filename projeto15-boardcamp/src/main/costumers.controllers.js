export function validateCostumerBody(req, res, next) { }

const costumers = [
    {
        id: 1,
        name: 'João Alfredo',
        phone: '21998899222',
        cpf: '01234567890',
        birthday: '1992-10-05'
    },
    {
        id: 2,
        name: 'Maria Alfreda',
        phone: '21998899221',
        cpf: '12345678910',
        birthday: '1994-12-25'
    },
]

export function getCostumers(req, res) { res.send(costumers) }
export function getCostumerById(req, res) { }
export function postCostumer(req, res) { }
export function updateCostumer(req, res) { }