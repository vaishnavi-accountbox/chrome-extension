/*
Object of countries based on 
http://en.wikipedia.org/wiki/List_of_IOC_country_codes
 */
function getCountriesList() {
	return {
		AFG : "Afghanistan",
		ALB : "Albania",
		ALG : "Algeria",
		AND : "Andorra",
		ANG : "Angola",
		ANT : "Antigua and Barbuda",
		ARG : "Argentina",
		ARM : "Armenia",
		ARU : "Aruba",
		ASA : "American Samoa",
		AUS : "Australia",
		AUT : "Austria",
		AZE : "Azerbaijan",
		BAH : "Bahamas",
		BAN : "Bangladesh",
		BAR : "Barbados",
		BDI : "Burundi",
		BEL : "Belgium",
		BEN : "Benin",
		BER : "Bermuda",
		BHU : "Bhutan",
		BIH : "Bosnia and Herzegovina",
		BIZ : "Belize",
		BLR : "Belarus",
		BOL : "Bolivia",
		BOT : "Botswana",
		BRA : "Brazil",
		BRN : "Bahrain",
		BRU : "Brunei",
		BUL : "Bulgaria",
		BUR : "Burkina Faso",
		CAF : "Central African Republic",
		CAM : "Cambodia",
		CAN : "Canada",
		CAY : "Cayman Islands",
		CGO : "Congo",
		CHA : "Chad",
		CHI : "Chile",
		CHN : "China",
		CIV : "Cote d'Ivoire",
		CMR : "Cameroon",
		COD : "DR Congo",
		COK : "Cook Islands",
		COL : "Colombia",
		COM : "Comoros",
		CPV : "Cape Verde",
		CRC : "Costa Rica",
		CRO : "Croatia",
		CUB : "Cuba",
		CYP : "Cyprus",
		CZE : "Czech Republic",
		DEN : "Denmark",
		DJI : "Djibouti",
		DMA : "Dominica",
		DOM : "Dominican Republic",
		ECU : "Ecuador",
		EGY : "Egypt",
		ERI : "Eritrea",
		ESA : "El Salvador",
		ESP : "Spain",
		EST : "Estonia",
		ETH : "Ethiopia",
		FIJ : "Fiji",
		FIN : "Finland",
		FRA : "France",
		FSM : "Micronesia",
		GAB : "Gabon",
		GAM : "Gambia",
		GBR : "Great Britain",
		GBS : "Guinea-Bissau",
		GEO : "Georgia",
		GEQ : "Equatorial Guinea",
		GER : "Germany",
		GHA : "Ghana",
		GRE : "Greece",
		GRN : "Grenada",
		GUA : "Guatemala",
		GUI : "Guinea",
		GUM : "Guam",
		GUY : "Guyana",
		HAI : "Haiti",
		HKG : "Hong Kong",
		HON : "Honduras",
		HUN : "Hungary",
		INA : "Indonesia",
		IND : "India",
		IRI : "Iran",
		IRL : "Ireland",
		IRQ : "Iraq",
		ISL : "Iceland",
		ISR : "Israel",
		ISV : "Virgin Islands",
		ITA : "Italy",
		IVB : "British Virgin Islands",
		JAM : "Jamaica",
		JOR : "Jordan",
		JPN : "Japan",
		KAZ : "Kazakhstan",
		KEN : "Kenya",
		KGZ : "Kyrgyzstan",
		KIR : "Kiribati",
		KOR : "South Korea",
		KSA : "Saudi Arabia",
		KUW : "Kuwait",
		LAO : "Laos",
		LAT : "Latvia",
		LBA : "Libya",
		LBR : "Liberia",
		LCA : "Saint Lucia",
		LES : "Lesotho",
		LIB : "Lebanon",
		LIE : "Liechtenstein",
		LTU : "Lithuania",
		LUX : "Luxembourg",
		MAD : "Madagascar",
		MAR : "Morocco",
		MAS : "Malaysia",
		MAW : "Malawi",
		MDA : "Moldova",
		MDV : "Maldives",
		MEX : "Mexico",
		MGL : "Mongolia",
		MHL : "Marshall Islands",
		MKD : "Macedonia",
		MLI : "Mali",
		MLT : "Malta",
		MNE : "Montenegro",
		MON : "Monaco",
		MOZ : "Mozambique",
		MRI : "Mauritius",
		MTN : "Mauritania",
		MYA : "Myanmar",
		NAM : "Namibia",
		NCA : "Nicaragua",
		NED : "Netherlands",
		NEP : "Nepal",
		NGR : "Nigeria",
		NIG : "Niger",
		NOR : "Norway",
		NRU : "Nauru",
		NZL : "New Zealand",
		OMA : "Oman",
		PAK : "Pakistan",
		PAN : "Panama",
		PAR : "Paraguay",
		PER : "Peru",
		PHI : "Philippines",
		PLE : "Palestine",
		PLW : "Palau",
		PNG : "Papua New Guinea",
		POL : "Poland",
		POR : "Portugal",
		PRK : "North Korea",
		PUR : "Puerto Rico",
		QAT : "Qatar",
		ROU : "Romania",
		RSA : "South Africa",
		RUS : "Russia",
		RWA : "Rwanda",
		SAM : "Samoa",
		SEN : "Senegal",
		SEY : "Seychelles",
		SIN : "Singapore",
		SKN : "Saint Kitts and Nevis",
		SLE : "Sierra Leone",
		SLO : "Slovenia",
		SMR : "San Marino",
		SOL : "Solomon Islands",
		SOM : "Somalia",
		SRB : "Serbia",
		SRI : "Sri Lanka",
		STP : "Sao Tome and Principe",
		SUD : "Sudan",
		SUI : "Switzerland",
		SUR : "Suriname",
		SVK : "Slovakia",
		SWE : "Sweden",
		SWZ : "Swaziland",
		SYR : "Syria",
		TAN : "Tanzania",
		TGA : "Tonga",
		THA : "Thailand",
		TJA : "Tajikistan",
		TKM : "Turkmenistan",
		TLS : "Timor-Leste",
		TOG : "Togo",
		TPE : "Chinese Taipei",
		TRI : "Trinidad and Tobago",
		TUN : "Tunisia",
		TUR : "Turkey",
		TUV : "Tuvalu",
		UAE : "United Arab Emirates",
		UGA : "Uganda",
		UKR : "Ukraine",
		URU : "Uruguay",
		USA : "United States",
		GB  : "United Kingdom",
		UZB : "Uzbekistan",
		VAN : "Vanuatu",
		VEN : "Venezuela",
		VIE : "Vietnam",
		VIN : "Saint Vincent and the Grenadines",
		YEM : "Yemen",
		ZAM : "Zambia",
		ZIM : "Zimbabwe"
	}
}

function countriesDropdown($container, name, classes, callback) {
	var countries = getCountriesList();
	var out = "<select class='" + classes + "' name='" + name
			+ "'><option value=''>--Select--</option>";
	for ( var key in countries) {
		out += "<option value='" + (countries[key]).toLowerCase() + "'>"
				+ countries[key] + "</option>";
	}
	out += "</select>";
	console.log(out);
	$container.replaceWith(out);

	if (callback)
		callback($container);
}

/*
 * Object of countries based on
 * http://en.wikipedia.org/wiki/List_of_IOC_country_codes
 */
function countriesDropdown2($container, callback) {
	var countries = getCountriesList();

	var out = "<option value=''>--Select--</option>";
	for ( var key in countries) {
		out += "<option value='" + (countries[key]) + "'>" + countries[key]
				+ "</option>";
	}
	$container.html(out);

	if (callback)
		callback($container);
}