/*Created - 14904
Resolved - 14905 - Configuration - 14906 - Cannot Reproduce - 14907 - As Designed - 14908 - Dupe - 14909 - Wont Fix - 14910 - Fixed - 14911 - Field - 14912 - Configuration - 14913 - Cannot Reproduce - 14914 - As Designed - 14915 - Dupe - 14916 - Wont Fix - 14917 - Fixed - 14918 - Triaged - 14919 - Configuration - 14920 - Cannot Reproduce - 14921 - As Designed - 14922 - Dupe - 14923 - Wont Fix - 14917 - Fixed - 14918

var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js";
$("head").append(s);

{
            "name": "Retail",
            "jql": "component not in (\"Payment From File\", \"Activity Center\", \"Commercial ACH\", \"Commercial Payments\", \"Commercial - Tax Payments\", \"Commercial - Templates\", \"Commercial - Treasury\", \"ACH - Template %26 Payments\", \"Wire - Template %26 Payments\", \"Payment Template\", \"Company Policy\", \"Policy Dashboard\", \"Policy Judge\", Recipients, \"User Management\", \"User Roles\", \"ACH Pass-Thru\", Reports, \"Wire Activity\", Subsidiaries, \"Tax Payments\", Multi-Transfer, \"Corporate Dashboard\")"
        }, {
            "name": "Commercial",
            "jql": "component in (\"Payment From File\", \"Activity Center\", \"Commercial ACH\", \"Commercial Payments\", \"Commercial - Tax Payments\", \"Commercial - Templates\", \"Commercial - Treasury\", \"ACH - Template %26 Payments\", \"Wire - Template %26 Payments\", \"Payment Template\", \"Company Policy\", \"Policy Dashboard\", \"Policy Judge\", Recipients, \"User Management\", \"User Roles\", \"ACH Pass-Thru\", Reports, \"Wire Activity\", Subsidiaries, \"Tax Payments\", Multi-Transfer, \"Corporate Dashboard\")"
        }, {
            name: "HQ",
            "jql": "project = HQ",
        }
*/
var results = [], timer = 0;
for (var o = 0; o < 52; o++) {
    results.push({ 
        'date': moment().subtract(o, 'weeks').format('YYYY-MM-DD'), 
        'startDate': moment().subtract(o + 52, 'weeks').format('YYYY-MM-DD') 
    });
}


let set = (obj, path, val) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const lastObj = keys.reduce((obj, key) =>
        obj[key] = obj[key] || {},
        obj);
    lastObj[lastKey] = val;
};

var schema = {
    "projects": [{
        "name": "UUX",
        "jql": "project = retail",
        "sub": []
    }],
    "metrics": [{
        "name": "Resolved",
        "jql": "status was not in (open, \"In Progress\") on %date",
        "sub": [{
            "name": "configuration",
            "jql": "resolution in (Configuration)"
        }, {
            "name": "cannot reproduce",
            "jql": "resolution in (\"Cannot Reproduce\")"
        }, {
            "name": "as designed",
            "jql": "resolution in (\"As Designed\")"
        }, {
            "name": "won't fix",
            "jql": "resolution in (\"Won't Fix\")"
        }, {
            "name": "duplicate",
            "jql": "resolution in (\"Duplicate\")"
        }, {
            "name": "fixed",
            "jql": "resolution in (\"Fixed\")"
        }, {
            "name": "P1",
            "jql": "priority = P1"
        }, {
            "name": "P2",
            "jql": "priority = P2"
        }, {
            "name": "P3",
            "jql": "priority = P3"
        }, {
            "name": "P4",
            "jql": "priority = P4"
        }, {
            "name": "field",
            "jql": "\"SalesForce Case Number\" is not empty",
            "sub": [{
                "name": "configuration",
                "jql": "resolution in (Configuration)"
            }, {
                "name": "cannot reproduce",
                "jql": "resolution in (\"Cannot Reproduce\")"
            }, {
                "name": "as designed",
                "jql": "resolution in (\"As Designed\")"
            }, {
                "name": "won't fix",
                "jql": "resolution in (\"Won't Fix\")"
            }, {
                "name": "duplicate",
                "jql": "resolution in (\"Duplicate\")"
            }, {
                "name": "fixed",
                "jql": "resolution in (\"Fixed\")"
            }, {
                "name": "P1",
                "jql": "priority = P1"
            }, {
                "name": "P2",
                "jql": "priority = P2"
            }, {
                "name": "P3",
                "jql": "priority = P3"
            }, {
                "name": "P4",
                "jql": "priority = P4"
            }]
        }, {
            "name": "triaged",
            "jql": "labels in (4.1Triage, \"4.1Triage(ELT)\", \"4.1Triage(RM/Supp)\", 4.2Triage, ImpsTriage)",
            "sub": [{
                "name": "configuration",
                "jql": "resolution in (Configuration)"
            }, {
                "name": "cannot reproduce",
                "jql": "resolution in (\"Cannot Reproduce\")"
            }, {
                "name": "as designed",
                "jql": "resolution in (\"As Designed\")"
            }, {
                "name": "won't fix",
                "jql": "resolution in (\"Won't Fix\")"
            }, {
                "name": "duplicate",
                "jql": "resolution in (\"Duplicate\")"
            }, {
                "name": "fixed",
                "jql": "resolution in (\"Fixed\")"
            }, {
                "name": "P1",
                "jql": "priority = P1"
            }, {
                "name": "P2",
                "jql": "priority = P2"
            }, {
                "name": "P3",
                "jql": "priority = P3"
            }, {
                "name": "P4",
                "jql": "priority = P4"
            }]
        }]
    }]
};

function executeJql(description, jql, resultSet, object) {
    let newJql = (jql || '') + ' AND ' + object.jql;
    let subNewJql = newJql.replace(/%startDate/g, resultSet.startDate);
    subNewJql = newJql.replace(/%date/g, resultSet.date);
    let newDescription = description + '.' + object.name;
    let url = 'https://jira/rest/api/2/search?jql=' + subNewJql + '&maxResults=1&fields=issuekey,priority,status,resolution,created,components';
    console.log(newDescription);
    console.log(url);

    $.ajax(url, {
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa("rhollister:Qx3rtwm8"));
        },
        success: function(data) {
            set(resultSet, newDescription + '.total', data.total);
        },
        timeout: 280000
    });
    if (object.sub) {
        object.sub.forEach(executeJql.bind(this, newDescription, newJql, resultSet));
    }
};

function runProjects(description, jql, resultSet, project) {
    let newJql = (jql || '') + ' AND ' + project.jql;
    let newDescription = description + '.' + project.name;
    executeJql(description, newJql, resultSet, { 'name': 'UUX', jql: 'project = retail'});
    schema.metrics.forEach(executeJql.bind(this, newDescription, newJql, resultSet));
    if (project.sub) {
        project.sub.forEach(runProjects.bind(this, newDescription, newJql, resultSet));
    }
};

results.forEach(function(result) {
    setTimeout(function() {
        schema.projects.forEach(runProjects.bind(this, 'Q2', 'type = bug AND createdDate >= ' + result.startDate + ' AND createdDate <= ' + result.date, result));
    }, timer)
    timer += 20000;
});
//2015-11-22
// var temp = {};
// schema.projects.forEach(runProjects.bind(this, 'Q2', 'createdDate >= 2015-11-22 AND createdDate <= 2016-11-20', temp));
