const corrections = {
	"minute": "min",
	"hour": "h",
	"day": "d",
	"week": "w",
	"month": "m",
	"year": "y"
}

for(var k in corrections) {
	corrections[k + "s"] = corrections[k]
}

const unit_type = {
	"min": "Minutes", 
	"h": "Hours", 
	"d": "Days", 
	"w": "Weeks", 
	"m": "Months", 
	"y": "Years", 
}

const unit_type_rev = {}
for(let key in unit_type){
	unit_type_rev[unit_type[key]] = key
}

export default {
	to_str: effort => {
		let key = Object.keys(effort)[0]
		if(key !== undefined) {
			return effort[key] + unit_type_rev[key]
		} 
	},
	equal: (a, b) => {
		let unit = Object.keys(a)[0]
		return unit !== undefined 
			&& unit == Object.keys(b)[0]
			&& a[unit] == b[unit]
	},
	from_str: effort_str => {
		let trimmed = effort_str.trim() 
		let numbers = trimmed.match(/(^(\d)*)/)[0]
		if(numbers.length > 0) {
			let value = Number(numbers)
			if(!isNaN(value)) {
				let unit = trimmed.slice(numbers.length).trim()
				unit = corrections[unit] || unit
				unit = unit_type[unit]
				if(unit !== undefined) {
					return { Ok: { [unit]: value } }
				}
			}
		}
		return { Err: "format has to be <number><unit>" }
	} 
}
