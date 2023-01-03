enum DataType {
    TinyInt = "TINYINT",
    SmallInt = "SMALLINT",
    TinyIntUnsigned = "TINYINT UNSIGNED",
    SmallIntUnsigned = "SMALLINT UNSIGNED",
    Float = "FLOAT",
    TinyText = "TINYTEXT",
    Text = "TEXT",
    Bool = "BOOL",
    DateTime = "DATETIME",
    Points = "MULTIPOINT",
    IntArray = "TEXT",
    FloatArray = "TEXT",
}

function stringToDataType(string: string): DataType | null {
    switch (string.toLowerCase()) {
        case "tinyint(1)":
            return DataType.Bool;
        case "datetime":
            return DataType.DateTime;
        case "float":
            return DataType.Float;
        case "multipoint":
            return DataType.Points;
        case "smallint":
            return DataType.SmallInt;
        case "smallint unsigned":
            return DataType.SmallIntUnsigned;
        case "text":
            return DataType.Text;
        case "tinyint":
            return DataType.TinyInt;
        case "tinyint unsigned":
            return DataType.TinyIntUnsigned;
        case "tinytext":
            return DataType.TinyText;
        default:
            return null;
    }

}

const Filters = {
    filterTinyInt(input: string): string {
        let preliminaryFilter = input.match(/[0-9]+/)?.[0];
        if (preliminaryFilter == null)
            return "0";
        let number = parseInt(preliminaryFilter);
        if (number >= Math.pow(2, 8))
            number = Math.pow(2, 8) - 1;
        if (number < -Math.pow(2, 8))
            number = -Math.pow(2, 8);

        return number.toString();
    },
    filterSmallInt(input: string): string {
        let preliminaryFilter = input.match(/[0-9]+/)?.[0];
        if (preliminaryFilter == null)
            return "0";
        let number = parseInt(preliminaryFilter);
        if (number >= Math.pow(2, 16))
            number = Math.pow(2, 16) - 1;
        if (number < -Math.pow(2, 16))
            number = -Math.pow(2, 16);

        return number.toString();
    },
    filterTinyIntUnsigned(input: string): string {
        let preliminaryFilter = input.match(/[0-9]+/)?.[0];
        if (preliminaryFilter == null)
            return "0";
        let number = parseInt(preliminaryFilter);
        if (number >= Math.pow(2, 16))
            number = Math.pow(2, 16) - 1;
        if (number < 0)
            number = 0

        return number.toString();
    },
    filterSmallIntUnsigned(input: string): string {
        let preliminaryFilter = input.match(/[0-9]+/)?.[0];
        if (preliminaryFilter == null)
            return "0";
        let number = parseInt(preliminaryFilter);
        if (number >= Math.pow(2, 32))
            number = Math.pow(2, 32) - 1;
        if (number < 0)
            number = 0;

        return number.toString();
    },
    filterFloat(input: string): string {
        let preliminaryFilter = input.match(/[0-9]*(\.[0-9]+)?/)?.[0];
        if (preliminaryFilter == null)
            return "0";
        return preliminaryFilter;
    },
    filterTinyText(input: string): string {
        input.replace(/\"/g, "'");
        return input.substring(0, 255);
    },
    filterText(input: string): string {
        input.replace(/\"/g, "'");
        return input.substring(0, 65535);
    },
    filterBool(input: string): string {
        let preliminaryFilter = input.match(/true|false/i)?.[0];
        if (preliminaryFilter == null)
            preliminaryFilter = "false";
        preliminaryFilter = preliminaryFilter.toLowerCase();
        if (preliminaryFilter == "true")
            return "1";

        else
            return "0";
    },
    filterDateTime(input: string): string {
        let preliminaryFilter = input.match(/[0-9]{4}-[01][0-9]-[0-3][0-9] [0-6][0-9]:[0-6][0-9]:[0-6][0-9]/)?.[0];
        if (preliminaryFilter == null) {
            let time = new Date();
            preliminaryFilter = getUTCDateTime();
        }
        return preliminaryFilter;
    },
    filterPoints(input: string): string {
        let preliminaryPoints = input.match(/([0-9]*(\.[0-9]+)|[0-9]),([0-9]*(\.[0-9]+)|[0-9])/g);
        if (preliminaryPoints == null)
            return "MULTIPOINT(0 0)";
        let points: string = "MULTIPOINT(";
        preliminaryPoints.forEach((value) => {
            points += value.replace(",", " ") + ", ";
        });
        points = points.replace(/, $/, "");
        points += ")";
        return points;
    },
    filterIntArray(input: string): string {
        let preliminaryInts = input.match(/[0-9]/g);
        if (preliminaryInts == null)
            return "[]";
        return `[${preliminaryInts.join(", ")}]`;
    },
    filterFloatArray(input: string): string {
        let preliminaryInts = input.match(/[0-9]*(\.[0-9]+)?/g);
        if (preliminaryInts == null)
            return "[]";
        return `[${preliminaryInts.join(", ")}]`;
    },
    filter(input: string, type: DataType) {
        switch (type) {
            case DataType.TinyInt:
                return this.filterTinyInt(input);

            case DataType.SmallInt:
                return this.filterSmallInt(input);

            case DataType.TinyIntUnsigned:
                return this.filterTinyIntUnsigned(input);

            case DataType.SmallIntUnsigned:
                return this.filterSmallIntUnsigned(input);

            case DataType.Float:
                return this.filterFloat(input);

            case DataType.TinyText:
                return this.filterTinyText(input);

            case DataType.Text:
                return this.filterText(input);

            case DataType.Bool:
                return this.filterBool(input);

            case DataType.DateTime:
                return this.filterDateTime(input);

            case DataType.Points:
                return this.filterPoints(input);

            case DataType.IntArray:
                return this.filterIntArray(input);

            case DataType.FloatArray:
                return this.filterFloatArray(input);

            default:
                return this.filterText(input);
        }
    }
};

function getUTCDateTime(): string {
    let time = new Date();
    return `${time.getUTCFullYear().toString().padStart(4, "0")}-${(time.getUTCMonth() + 1).toString().padStart(2, "0")}-${time.getUTCDate().toString().padStart(2, "0")} ${time.getUTCHours().toString().padStart(2, "0")}:${time.getUTCMinutes().toString().padStart(2, "0")}:${time.getUTCSeconds().toString().padStart(2, "0")}`;
}


export { DataType, Filters, stringToDataType, getUTCDateTime}