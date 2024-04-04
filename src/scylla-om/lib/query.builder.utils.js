const quotify = (value) => {
    if (typeof value === 'string') {
        return `'${value}'`
    }
    return value
}

const predicateFilter = (predicatesFilter, row) => {
    for (let pf of predicatesFilter) {
        const keyName = Object.keys(pf)[0]
        if (!pf[keyName].includes(row[keyName])) {
            return false
        }
    }
    return true
}

const streamFilter = (predicatesFilter) => {
    const filtered = []
    const collect = (value) => {
        const row = JSON.parse(value['[json]'])

        if (predicateFilter(predicatesFilter, row)) {
            filtered.push(row)
        }
    }

    const result = () => {
        return filtered
    }
    return {
        collect,
        result
    }
}

const projectionFilter = (projections) => {
    const _proj = projections.map(p => p.field)
    return (row) => {
        return _proj.reduce((acc, field) => {
            return {
                ...acc,
                [field]: row[field]
            }

        }, {})
    }
}


const groupPredicates = (primaryKeys, predicates) => {
    const predicatesPK = []
    const predicatesFilter = []

    //Indenify in order primary key predicates 
    for (var i = 0; i < primaryKeys.length; i++) {
        const pk = primaryKeys[i]
        if (predicates[pk]) {
            predicatesPK.push({ [pk]: predicates[pk] })
        }
        else {
            break;
        }
    }

    //Identify other primary key predicates
    for (var j = i; j < primaryKeys.length; j++) {
        const pk = primaryKeys[j]
        if (predicates[pk]) {
            predicatesFilter.push({ [pk]: predicates[pk] })
        }
    }

    //Identify the rest (non-primary key predicates)
    for (let predicateField in predicates) {
        const item = predicatesPK.find((pf) => pf[predicateField])
            || predicatesFilter.find((pf) => pf[predicateField])

        if (!item) {
            predicatesFilter.push({ [predicateField]: predicates[predicateField] })
        }
    }

    return [predicatesPK, predicatesFilter];
}

const collectAllProjections = (projections, predicates) => {
    const projectionsAll = new Set();
    projections.forEach(p => projectionsAll.add(p.field))
    Object.keys(predicates).forEach(p => projectionsAll.add(p))
    return Array.from(projectionsAll)
}


module.exports = {
    streamFilter,
    projectionFilter,
    collectAllProjections,
    groupPredicates,
    quotify
}