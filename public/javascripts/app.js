var app = angular.module('calendarApp', ['ui.bootstrap'])
    .directive('repeatDirective', function () {
        return function (scope, element, attrs) {
            if (scope.$last) {
                $('.hiddenElements').hide();
            }
        };
    });
app.factory('classroomFactory', ['$http', function ($http) {

    var classroomFactory = {};

    classroomFactory.findAll = function () {
        return $http.get('/getClassrooms');
    };

    classroomFactory.find = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    classroomFactory.add = function (data) {
        return $http.post('/addClassroom/', data);
    };

    classroomFactory.edit = function (classroom, newName) {
        return $http.put('/editClassroom/' + classroom._id + '/' + newName);
    };

    classroomFactory.delete = function (classroom) {
        return $http.delete('/deleteClassroom/' + classroom._id);
    };

    return classroomFactory;
}]);
app.factory('teacherFactory', ['$http', function ($http) {

    var teacherFactory = {};

    teacherFactory.findAll = function () {
        return $http.get('/getTeachers');
    };

    teacherFactory.find = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    teacherFactory.add = function (data) {
        return $http.post('/addTeacher/', data);
    };

    teacherFactory.edit = function (teacher, new_last_name, new_first_name) {
        return $http.put('/editTeacher/' + teacher._id + '/' + new_last_name + '/' + new_first_name);
    };

    teacherFactory.delete = function (teacher) {
        return $http.delete('/deleteTeacher/' + teacher._id);
    };

    return teacherFactory;
}]);
app.factory('courseFactory', ['$http', function ($http) {

    var courseFactory = {};

    courseFactory.findAll = function () {
        return $http.get('/getCourses');
    };

    courseFactory.find = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    courseFactory.add = function (data) {
        return $http.post('/addCourse/', data);
    };

    courseFactory.edit = function (course, newName) {
        return $http.put('/editCourse/' + course._id + '/' + newName);
    };

    courseFactory.delete = function (course) {
        return $http.delete('/deleteCourse/' + course._id);
    };

    return courseFactory;
}]);
app.factory('promotionFactory', ['$http', function ($http) {

    var promotionFactory = {};

    promotionFactory.findAll = function () {
        return $http.get('/getPromotions');
    };

    promotionFactory.find = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    promotionFactory.add = function (data) {
        return $http.post('/addPromotion/', data);
    };

    promotionFactory.edit = function (promotion, newName) {
        return $http.put('/editPromotion/' + promotion._id + '/' + newName);
    };

    promotionFactory.delete = function (promotion) {
        return $http.delete('/deletePromotion/' + promotion._id);
    };

    return promotionFactory;
}]);
app.factory('scheduleFactory', ['$http', function ($http) {

    var scheduleFactory = {};

    scheduleFactory.findAll = function () {
        return $http.get('/getSchedules');
    };

    scheduleFactory.find = function (id) {
        return $http.get(urlBase + '/' + id);
    };

    scheduleFactory.getSlotsTaken = function (day, month, year, promotion) {
        return $http.get('getSlotsTaken/' + day + '/' + month + '/' + year + '/' + promotion._id);
    };

    scheduleFactory.getScheduleModels = function () {
        return $http.get('getSchedulesModels/');
    };

    scheduleFactory.getTeacherTotalHour = function (teacher) {
        return $http.get('getTeacherTotalHour/' + teacher._id);
    };

    scheduleFactory.getTeacherTotalHourByCourse = function (teacher, course) {
        return $http.get('getTeacherTotalHourByCourse/' + teacher._id + '/' + course._id);
    };

    scheduleFactory.getPromotionTotalHourByCourse = function (promotion, course) {
        return $http.get('getPromotionTotalHourByCourse/' + promotion._id + '/' + course._id);
    };

    scheduleFactory.isClassroomTaken = function (classroom, course, day, month, year, begin, end) {
        return $http.get('isClassroomTaken/' + classroom._id + '/' + course._id + '/' + day + '/' + month + '/' + year + '/' + begin + '/' + end);
    };

    scheduleFactory.isTeacherTaken = function (teachers, course, day, month, year, begin, end) {
        return $http.get('isTeacherTaken/' + teachers + '/' + course._id + '/' + day + '/' + month + '/' + year + '/' + begin + '/' + end);
    };

    scheduleFactory.add = function (data) {
        return $http.post('/addSchedule/', data);
    };


    scheduleFactory.edit = function (promotion, newName) {
        return $http.put('/editPromotion/' + promotion._id + '/' + newName);
    };

    scheduleFactory.delete = function (promotion) {
        return $http.delete('/deletePromotion/' + promotion._id);
    };

    return scheduleFactory;
}]);
app.filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start; //parse to int
            return input.slice(start);
        }
        return [];
    }
});
app.config(function ($routeProvider) {
    $routeProvider
        .when('/',
        {
            controller: 'FrontOfficeController',
            templateUrl: 'partials/index.html'
        })
        .when('/classrooms',
        {
            controller: 'ClassroomController',
            templateUrl: 'partials/classrooms.html'
        })
        .when('/teachers',
        {
            controller: 'TeacherController',
            templateUrl: 'partials/teachers.html'
        })
        .when('/courses',
        {
            controller: 'CourseController',
            templateUrl: 'partials/courses.html'
        })
        .when('/promotions',
        {
            controller: 'PromotionController',
            templateUrl: 'partials/promotions.html'
        })
        .when('/schedules',
        {
            controller: 'ScheduleController',
            templateUrl: 'partials/schedules.html'
        })
        .when('/csv',
        {
            controller: 'CsvController',
            templateUrl: 'partials/csv.html'
        })
        .otherwise({redirectTo: '/'});
});
app.controller('ClassroomController', ['$scope', '$http', '$timeout', 'classroomFactory', function ($scope, $http, $timeout, classroomFactory) {
    $scope.isCollapsed = false;
    $scope.entryLimit = 10;

    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    $scope.classroomsFiltered = new Array();
    $scope.data = {};

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.init = function () {
        $scope.findAll();
    }

    $scope.collapse = function () {
        $scope.isCollapsed = !$scope.isCollapsed;
        if (!$scope.isCollapsed)$('#addButton').text("Ajouter");
        else {
            $scope.data = {};
            $('#addButton').text("Annuler");
        }
    }

    $scope.add = function () {
        if ($scope.data.name !== undefined) {
            classroomFactory.add($scope.data).success(function (data, status, headers, config) {
                if (!$scope.classrooms)$scope.findAll();
                $scope.classrooms.push(data);
                $scope.filter();
            });
            $scope.data = {};
        }
    };
    $scope.findAll = function () {
        classroomFactory.findAll().success(function (data, status, headers, config) {
            $scope.classrooms = data;
            if ($scope.classrooms)$scope.noOfPages = Math.ceil($scope.classrooms.length / $scope.entryLimit);
        });
    };
    $scope.delete = function (classroom) {
        classroomFactory.delete(classroom).success(function (data, status, headers, config) {
            $scope.classrooms.splice($scope.classrooms.indexOf(classroom), 1);
            if ((($scope.classrooms.length) % $scope.entryLimit) === 0) {
                $scope.currentPage--;
                $scope.noOfPages = Math.ceil($scope.classrooms.length / $scope.entryLimit);
            }
        });
    }
    $scope.edit = function (classroom) {
        $("#span" + classroom._id).hide();
        $("#editButton" + classroom._id).hide();
        $("#deleteButton" + classroom._id).hide();
        $("#saveButton" + classroom._id).show();
        $("#cancelButton" + classroom._id).show();
        $("#text" + classroom._id).val(classroom.name).show();
    }
    $scope.edit_save = function (classroom) {
        var newName = $("#text" + classroom._id).val();
        if (newName != "") {
            classroomFactory.edit(classroom, newName).success(function (data, status, headers, config) {
                $scope.classrooms[$scope.classrooms.indexOf(classroom)].name = newName;
            });
            $("#span" + classroom._id).show();
            $("#editButton" + classroom._id).show();
            $("#deleteButton" + classroom._id).show();
            $("#saveButton" + classroom._id).hide();
            $("#cancelButton" + classroom._id).hide();
            $("#text" + classroom._id).hide();
        }
    }
    $scope.cancel = function (classroom) {
        $("#span" + classroom._id).show();
        $("#editButton" + classroom._id).show();
        $("#deleteButton" + classroom._id).show();
        $("#saveButton" + classroom._id).hide();
        $("#cancelButton" + classroom._id).hide();
        $("#text" + classroom._id).hide();
    }

    $scope.filter = function () {
        $timeout(function () { //wait for 'filtered' to be changed
            $scope.noOfPages = Math.ceil($scope.classroomsFiltered.length / $scope.entryLimit);
            $scope.setPage = function (pageNo) {
                $scope.currentPage = pageNo;
            };
            $('.hiddenElements').hide();
        }, 2);

    };

}]);
app.controller('TeacherController', ['$scope', '$http', '$timeout', 'teacherFactory', function ($scope, $http, $timeout, teacherFactory) {
    $scope.isCollapsed = false;
    $scope.entryLimit = 10;

    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    $scope.teachersFiltered = new Array();

    $scope.data = {};

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.init = function () {
        $scope.findAll();
    }

    $scope.collapse = function () {
        $scope.isCollapsed = !$scope.isCollapsed;
        if (!$scope.isCollapsed)$('#addButton').text("Ajouter");
        else {
            $scope.data = {};
            $('#addButton').text("Annuler");
        }
    }

    $scope.add = function () {
        if ($scope.data.last_name !== undefined && $scope.data.first_name !== undefined) {
            teacherFactory.add($scope.data).success(function (data, status, headers, config) {
                if (!$scope.teachers)$scope.findAll();
                $scope.teachers.push(data);
                $scope.filter();
            });
            $scope.data = {};
        }
    };
    $scope.findAll = function () {
        teacherFactory.findAll().success(function (data, status, headers, config) {
            $scope.teachers = data;
            if ($scope.teachers)$scope.noOfPages = Math.ceil($scope.teachers.length / $scope.entryLimit);
        });
    };
    $scope.delete = function (teacher) {
        teacherFactory.delete(teacher).success(function (data, status, headers, config) {
            $scope.teachers.splice($scope.teachers.indexOf(teacher), 1);
            if ((($scope.teachers.length) % $scope.entryLimit) === 0) {
                $scope.currentPage--;
                $scope.noOfPages = Math.ceil($scope.teachers.length / $scope.entryLimit);
            }
        });
    }
    $scope.edit = function (teacher) {
        $("#span_last_name" + teacher._id).hide();
        $("#span_first_name" + teacher._id).hide();
        $("#editButton" + teacher._id).hide();
        $("#deleteButton" + teacher._id).hide();
        $("#saveButton" + teacher._id).show();
        $("#cancelButton" + teacher._id).show();
        $("#text_last_name" + teacher._id).val(teacher.last_name).show();
        $("#text_first_name" + teacher._id).val(teacher.first_name).show();
    }
    $scope.edit_save = function (teacher) {
        var new_last_name = $("#text_last_name" + teacher._id).val();
        var new_first_name = $("#text_first_name" + teacher._id).val();
        if (new_last_name != "" && new_first_name != "") {
            teacherFactory.edit(teacher, new_last_name, new_first_name).success(function (data, status, headers, config) {
                $scope.teachers[$scope.teachers.indexOf(teacher)].last_name = new_last_name;
                $scope.teachers[$scope.teachers.indexOf(teacher)].first_name = new_first_name;
            });
            $("#span_last_name" + teacher._id).show();
            $("#span_first_name" + teacher._id).show();
            $("#editButton" + teacher._id).show();
            $("#deleteButton" + teacher._id).show();
            $("#saveButton" + teacher._id).hide();
            $("#cancelButton" + teacher._id).hide();
            $("#text_last_name" + teacher._id).hide();
            $("#text_first_name" + teacher._id).hide();
        }
    }
    $scope.cancel = function (teacher) {
        $("#span_last_name" + teacher._id).show();
        $("#span_first_name" + teacher._id).show();
        $("#editButton" + teacher._id).show();
        $("#deleteButton" + teacher._id).show();
        $("#saveButton" + teacher._id).hide();
        $("#cancelButton" + teacher._id).hide();
        $("#text_last_name" + teacher._id).hide();
        $("#text_first_name" + teacher._id).hide();
    }

    $scope.filter = function () {
        $timeout(function () { //wait for 'filtered' to be changed
            $scope.noOfPages = Math.ceil($scope.teachersFiltered.length / $scope.entryLimit);
            $scope.setPage = function (pageNo) {
                $scope.currentPage = pageNo;
            };
            $('.hiddenElements').hide();
        }, 2);

    };
}]);
app.controller('CourseController', ['$scope', '$http', '$timeout', 'courseFactory', function ($scope, $http, $timeout, courseFactory) {
    $scope.isCollapsed = false;
    $scope.entryLimit = 10;

    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    $scope.coursesFiltered = new Array();
    $scope.data = {};

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.init = function () {
        $scope.findAll();
    }

    $scope.collapse = function () {
        $scope.isCollapsed = !$scope.isCollapsed;
        if (!$scope.isCollapsed)$('#addButton').text("Ajouter");
        else {
            $scope.data = {};
            $('#addButton').text("Annuler");
        }
    }

    $scope.add = function () {
        if ($scope.data.name !== undefined) {
            courseFactory.add($scope.data).success(function (data, status, headers, config) {
                if (!$scope.courses)$scope.findAll();
                $scope.courses.push(data);
                $scope.filter();
            });
            $scope.data = {};
        }
    };
    $scope.findAll = function () {
        courseFactory.findAll().success(function (data, status, headers, config) {
            $scope.courses = data;
            if ($scope.courses)$scope.noOfPages = Math.ceil($scope.courses.length / $scope.entryLimit);
        });
    };
    $scope.delete = function (course) {
        courseFactory.delete(course).success(function (data, status, headers, config) {
            $scope.courses.splice($scope.courses.indexOf(course), 1);
            if ((($scope.courses.length) % $scope.entryLimit) === 0) {
                $scope.currentPage--;
                $scope.noOfPages = Math.ceil($scope.courses.length / $scope.entryLimit);
            }
        });
    }
    $scope.edit = function (course) {
        $("#span" + course._id).hide();
        $("#editButton" + course._id).hide();
        $("#deleteButton" + course._id).hide();
        $("#saveButton" + course._id).show();
        $("#cancelButton" + course._id).show();
        $("#text" + course._id).val(course.name).show();
    }
    $scope.edit_save = function (course) {
        var newName = $("#text" + course._id).val();
        if (newName != "") {
            courseFactory.edit(course, newName).success(function (data, status, headers, config) {
                $scope.courses[$scope.courses.indexOf(course)].name = newName;
            });
            $("#span" + course._id).show();
            $("#editButton" + course._id).show();
            $("#deleteButton" + course._id).show();
            $("#saveButton" + course._id).hide();
            $("#cancelButton" + course._id).hide();
            $("#text" + course._id).hide();
        }
    }
    $scope.cancel = function (course) {
        $("#span" + course._id).show();
        $("#editButton" + course._id).show();
        $("#deleteButton" + course._id).show();
        $("#saveButton" + course._id).hide();
        $("#cancelButton" + course._id).hide();
        $("#text" + course._id).hide();
    }

    $scope.filter = function () {
        $timeout(function () { //wait for 'filtered' to be changed
            $scope.noOfPages = Math.ceil($scope.coursesFiltered.length / $scope.entryLimit);
            $scope.setPage = function (pageNo) {
                $scope.currentPage = pageNo;
            };
            $('.hiddenElements').hide();
        }, 2);

    };
}]);
app.controller("PromotionController", ['$scope', '$http', '$timeout', 'promotionFactory', function ($scope, $http, $timeout, promotionFactory) {
    $scope.isCollapsed = false;
    $scope.entryLimit = 10;

    $scope.noOfPages = 1;
    $scope.currentPage = 1;
    $scope.promotionsFiltered = new Array();
    $scope.data = {};

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.init = function () {
        $scope.findAll();
    }

    $scope.collapse = function () {
        $scope.isCollapsed = !$scope.isCollapsed;
        if (!$scope.isCollapsed)$('#addButton').text("Ajouter");
        else {
            $scope.data = {};
            $('#addButton').text("Annuler");
        }
    }

    $scope.add = function () {
        if ($scope.data.name !== undefined) {
            promotionFactory.add($scope.data).success(function (data, status, headers, config) {
                if (!$scope.promotions)$scope.findAll();
                $scope.promotions.push(data);
                $scope.filter();
            });
            $scope.data = {};
        }
    };
    $scope.findAll = function () {
        promotionFactory.findAll().success(function (data, status, headers, config) {
            $scope.promotions = data;
            if ($scope.promotions)$scope.noOfPages = Math.ceil($scope.promotions.length / $scope.entryLimit);
        });
    };
    $scope.delete = function (promotion) {
        promotionFactory.delete(promotion).success(function (data, status, headers, config) {
            $scope.promotions.splice($scope.promotions.indexOf(promotion), 1);
            if ((($scope.promotions.length) % $scope.entryLimit) === 0) {
                $scope.currentPage--;
                $scope.noOfPages = Math.ceil($scope.promotions.length / $scope.entryLimit);
            }
        });
    }
    $scope.edit = function (promotion) {
        $("#span" + promotion._id).hide();
        $("#editButton" + promotion._id).hide();
        $("#deleteButton" + promotion._id).hide();
        $("#saveButton" + promotion._id).show();
        $("#cancelButton" + promotion._id).show();
        $("#text" + promotion._id).val(promotion.name).show();
    }
    $scope.edit_save = function (promotion) {
        var newName = $("#text" + promotion._id).val();
        if (newName != "") {
            promotionFactory.edit(promotion, newName).success(function (data, status, headers, config) {
                $scope.promotions[$scope.promotions.indexOf(promotion)].name = newName;
            });
            $("#span" + promotion._id).show();
            $("#editButton" + promotion._id).show();
            $("#deleteButton" + promotion._id).show();
            $("#saveButton" + promotion._id).hide();
            $("#cancelButton" + promotion._id).hide();
            $("#text" + promotion._id).hide();
        }
    }
    $scope.cancel = function (promotion) {
        $("#span" + promotion._id).show();
        $("#editButton" + promotion._id).show();
        $("#deleteButton" + promotion._id).show();
        $("#saveButton" + promotion._id).hide();
        $("#cancelButton" + promotion._id).hide();
        $("#text" + promotion._id).hide();
    }

    $scope.filter = function () {
        $timeout(function () { //wait for 'filtered' to be changed
            $scope.noOfPages = Math.ceil($scope.promotionsFiltered.length / $scope.entryLimit);
            $scope.setPage = function (pageNo) {
                $scope.currentPage = pageNo;
            };
            $('.hiddenElements').hide();
        }, 2);

    };
}]);
app.controller('ScheduleController', ['$scope', '$http', '$timeout', 'classroomFactory', 'teacherFactory', 'courseFactory',
    'promotionFactory', 'scheduleFactory', function ($scope, $http, $timeout, classroomFactory, teacherFactory, courseFactory, promotionFactory, scheduleFactory) {

        $scope.init = function () {
            classroomFactory.findAll().success(function (data, status, headers, config) {
                $scope.classrooms = data;
            });
            teacherFactory.findAll().success(function (data, status, headers, config) {
                $scope.teachers = data;
                $scope.teachersLeft = $scope.teachers.slice(0);
            });
            courseFactory.findAll().success(function (data, status, headers, config) {
                $scope.courses = data;
            });
            promotionFactory.findAll().success(function (data, status, headers, config) {
                $scope.promotions = data;
                //On l'appelle lors du dernier findAll pour être sûr que la vue est bien chargée
                $scope.loadColors();
            });

        };

        $scope.teacherHours = Array();
        $scope.teacherHoursByCourse = Array();
        $scope.possibleSlots = Array();
        $scope.alerts = Array();

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };


        $scope.loadColors = function () {
            $("#wheel_model_schedule").minicolors({
                control: $(this).attr('data-control') || 'wheel',
                defaultValue: $(this).attr('data-defaultValue') || '#18b1dd',
                inline: $(this).attr('data-inline') === 'true',
                letterCase: $(this).attr('data-letterCase') || 'lowercase',
                opacity: $(this).attr('data-opacity'),
                position: $(this).attr('data-position') || 'bottom left',
                change: function (hex, opacity) {
                    if (!hex) return;
                    if (opacity) hex += ', ' + opacity;
                    $('.schedule_preview').css('background-color', hex);
                },
                theme: 'bootstrap'
            });
            $("#wheel_schedule").minicolors({
                control: $(this).attr('data-control') || 'wheel',
                defaultValue: $(this).attr('data-defaultValue') || '#18b1dd',
                inline: $(this).attr('data-inline') === 'true',
                letterCase: $(this).attr('data-letterCase') || 'lowercase',
                opacity: $(this).attr('data-opacity'),
                position: $(this).attr('data-position') || 'bottom left',
                change: function (hex, opacity) {
                    if (!hex) return;
                    if (opacity) hex += ', ' + opacity;
                    $('.schedule_preview').css('background-color', hex);
                },
                theme: 'bootstrap'
            });
        };

        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.showWeeks = true;
        $scope.toggleWeeks = function () {
            $scope.showWeeks = !$scope.showWeeks;
        };

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        $scope.disabled = function (date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.toggleMin = function () {
            $scope.minDate = ( $scope.minDate ) ? null : new Date(2012, 0, 1);
        };
        $scope.toggleMin();

        $scope.open = function () {
            $timeout(function () {
                $scope.opened = true;
            });
        };

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1
        };

        $scope.format = "yyyy/MM/dd";

        $scope.checkSlotsTaken = function () {
            $scope.slots = Array(
                {id: 1, taken: false, name: "8:45 - 9:45"},
                {id: 2, taken: false, name: "9:45 - 10:45"},
                {id: 3, taken: false, name: "11:00 - 12:00"},
                {id: 4, taken: false, name: "12:00 - 13:00"},
                {id: 5, taken: false, name: "13:45 - 14:45"},
                {id: 6, taken: false, name: "14:45 - 15:45"},
                {id: 7, taken: false, name: "16:00 - 17:00"},
                {id: 8, taken: false, name: "17:00 - 18:00"});
            if ($scope.promotion !== undefined && $scope.promotion !== "")
                console.log($scope.dt);
            scheduleFactory.getSlotsTaken($scope.dt.getDate(), $scope.dt.getMonth(), $scope.dt.getFullYear(), $scope.promotion)
                .success(function (data) {
                    for (var index in $scope.slots) {
                        $scope.slots[index].taken = false;
                    }
                    for (var index in data) {
                        if (data[index].begin === data[index].end) {
                            $scope.slots[data[index].begin - 1].taken = true;
                        }
                        else {
                            var diff = data[index].end - data[index].begin;
                            for (var i = data[index].begin - 1; i <= diff + data[index].begin - 1; i++) {
                                $scope.slots[i].taken = true;
                            }
                        }
                    }
                });
        };

        $scope.teachersTab = Array();

        $scope.appendTeacher = function () {
            var teacher = $scope.teacher;
            if ($scope.teacher !== undefined && $scope.teacher !== "" && $scope.teachersTab.length < 2) {
                $scope.teachersTab.push($scope.teacher);
                $scope.teachersLeft.splice($scope.teachersLeft.indexOf($scope.teacher), 1);
                scheduleFactory.getTeacherTotalHour(teacher).success(function (data) {
                    var temp = teacher.last_name + " " + teacher.first_name.charAt(0).toUpperCase() + ". : " + data;
                    $scope.teacherHours.push(temp);
                });
                if ($scope.course !== undefined && $scope.course !== "") {
                    scheduleFactory.getTeacherTotalHourByCourse(teacher, $scope.course).success(function (data) {
                        var temp = teacher.last_name + " " + teacher.first_name.charAt(0).toUpperCase() + ". : " + data;
                        $scope.teacherHoursByCourse.push(temp);
                    });
                }
                $scope.teacher = undefined;
            }
        };

        $scope.cancelTeacher = function (teacherAdded) {
            $scope.teachersLeft.push(teacherAdded);
            $scope.teacherHoursByCourse.splice($scope.teachersTab.indexOf(teacherAdded), 1);
            $scope.teacherHours.splice($scope.teachersTab.indexOf(teacherAdded), 1);
            $scope.teachersTab.splice($scope.teachersTab.indexOf(teacherAdded), 1);

        };

        $scope.checkCourseHours = function () {
            $scope.teacherHoursByCourse.length = 0;
            if ($scope.teachersTab.length > 0 && $scope.course !== undefined && $scope.course !== "") {
                var index = 0;
                scheduleFactory.getTeacherTotalHourByCourse($scope.teachersTab[index], $scope.course).success(function (data) {
                    var temp = $scope.teachersTab[index].last_name + " " + $scope.teachersTab[index].first_name.charAt(0).toUpperCase() + ". : " + data;
                    $scope.teacherHoursByCourse.push(temp);
                    if ($scope.teachersTab.length > 1) {
                        index = 1;
                        scheduleFactory.getTeacherTotalHourByCourse($scope.teachersTab[index], $scope.course).success(function (data) {
                            var temp = $scope.teachersTab[index].last_name + " " + $scope.teachersTab[index].first_name.charAt(0).toUpperCase() + ". : " + data;
                            $scope.teacherHoursByCourse.push(temp);

                        });
                    }
                });

            }
        };

        $scope.checkPromotionHours = function () {
            $scope.promotionHours = Array();
            if ($scope.course !== undefined && $scope.course !== "" && !$.isEmptyObject($scope.course)
                && $scope.promotion !== undefined && $scope.promotion !== "" && !$.isEmptyObject($scope.promotion)) {
                scheduleFactory.getPromotionTotalHourByCourse($scope.promotion, $scope.course).success(function (data) {
                    $scope.promotionHours = $scope.promotion.name + " : " + data;
                });
            }
        };

        /*
         Pour limiter l'input de end en fonction de begin et des slots possibles qu'il reste
         */
        $scope.checkPossibleSlots = function () {
            $scope.possibleSlots.length = 0;
            for (var i = $scope.slots.indexOf($scope.begin); i < $scope.slots.length; i++) {
                if ($scope.slots[i].taken)break;
                $scope.possibleSlots.push($scope.slots[i]);
            }
        };

        $scope.addScheduleModel = function () {
            var teachersIDs = Array();
            for (var id in $scope.teachersTab) {
                teachersIDs.push($scope.teachersTab[id]._id);
            }
            var schedule = {
                teachers: teachersIDs,
                classroom: $scope.classroom._id,
                course: $scope.course._id,
                promotion: $scope.promotion._id,
                //date: null,
                color: $('#wheel_model_schedule').val(),
                begin: null,
                end: null
            };
            console.log(schedule);
            scheduleFactory.add(schedule).success(function (data, status, headers, config) {
                $scope.result = data;
            });
        };

        $scope.addSchedule = function () {
            if ($scope.classroom !== undefined && $scope.classroom !== "" && !$.isEmptyObject($scope.classroom)
                && $scope.course !== undefined && $scope.course !== "" && !$.isEmptyObject($scope.course)
                && $scope.promotion !== undefined && $scope.promotion !== "" && !$.isEmptyObject($scope.promotion)
                && $scope.begin !== undefined && $scope.begin !== "" && !$.isEmptyObject($scope.begin)
                && $scope.end !== undefined && $scope.end !== "" && !$.isEmptyObject($scope.end)) {
                if ($scope.begin.id > $scope.end.id) {
                    $scope.alerts.length = 0;
                    $scope.alerts.push({type: 'error', msg: "La tranche de début ne peut être supérieure à la tranche de fin"})
                }
                var teachersIDs = Array();
                for (id in $scope.teachersTab) {
                    teachersIDs.push($scope.teachersTab[id]._id);
                }
                if (teachersIDs.length === 0)teachersIDs = null;
                var schedule = {
                    teachers: teachersIDs,
                    classroom: $scope.classroom._id,
                    course: $scope.course._id,
                    promotion: $scope.promotion._id,
                    date: $scope.dt,
                    color: $('#wheel_schedule').val(),
                    begin: $scope.begin.id,
                    end: $scope.end.id
                };
                scheduleFactory.isClassroomTaken($scope.classroom, $scope.course, $scope.dt.getDate(),
                        $scope.dt.getMonth(), $scope.dt.getFullYear(), $scope.begin.id, $scope.end.id)
                    .success(function (data) {
                        if (data === "true") {
                            $scope.alerts.length = 0;
                            $scope.alerts.push({type: 'error', msg: "Cette classe est déjà prise à cette heure là"});
                        }
                        else {
                            scheduleFactory.isTeacherTaken(schedule.teachers, $scope.course, $scope.dt.getDate(),
                                    $scope.dt.getMonth(), $scope.dt.getFullYear(), $scope.begin.id, $scope.end.id)
                                .success(function (data) {
                                    if (data === "true") {
                                        $scope.alerts.length = 0;
                                        $scope.alerts.push({type: 'error', msg: "Ce(s) professeur(s) donne(nt) déjà un autre cours à ces tranches là"});
                                    }
                                    else {
                                        scheduleFactory.add(schedule)
                                            .success(function (data) {
                                                $scope.result = data;
                                                $scope.classroom = {};
                                                $scope.course = {};
                                                $scope.teachersLeft = $scope.teachers.slice(0);
                                                $scope.teachersTab.length = 0;
                                                $scope.teacherHours.length = 0;
                                                $scope.teacherHoursByCourse.length = 0;
                                                $scope.promotionHours = undefined;
                                                $scope.promotion = {};
                                                $scope.begin = {};
                                                $scope.end = {};
                                                $scope.alerts.length = 0;
                                                $scope.possibleSlots.length = 0;
                                                $scope.alerts.push({type: 'success', msg: "Insertion de cours réussie"});

                                            })
                                            .error(function () {
                                                $scope.alerts.length = 0;
                                                $scope.alerts.push({type: 'error', msg: "Un problème est survenu"})
                                            });
                                    }
                                });
                        }
                    });
            }
            else {
                $scope.alerts.length = 0;
                $scope.alerts.push({type: 'error', msg: "Veuillez remplir tous les champs"})
            }
        };

        $scope.test = function () {
            scheduleFactory.findAll().success(function (data) {
                $scope.test = data;
            })
        }

    }]);
app.controller('CsvController', function ($scope, $http, $timeout) {

    $.fn.upload = function (remote, data, successFn, progressFn) {
        // if we dont have post data, move it along
        if (typeof data != "object") {
            progressFn = successFn;
            successFn = data;
        }
        return this.each(function () {
            if ($(this)[0].files[0]) {
                var formData = new FormData();
                formData.append($(this).attr("name"), $(this)[0].files[0]);

                // if we have post data too
                if (typeof data == "object") {
                    for (var i in data) {
                        formData.append(i, data[i]);
                    }
                }

                // do the ajax request
                $.ajax({
                    url: remote,
                    type: 'POST',
                    xhr: function () {
                        myXhr = $.ajaxSettings.xhr();
                        if (myXhr.upload && progressFn) {
                            myXhr.upload.addEventListener('progress', function (prog) {
                                var value = ~~((prog.loaded / prog.total) * 100);

                                // if we passed a progress function
                                if (progressFn && typeof progressFn == "function") {
                                    progressFn(prog, value);

                                    // if we passed a progress element
                                } else if (progressFn) {
                                    $(progressFn).val(value);
                                }
                            }, false);
                        }
                        return myXhr;
                    },
                    data: formData,
                    dataType: "json",
                    cache: false,
                    contentType: false,
                    processData: false,
                    complete: function (res) {
                        var json;
                        try {
                            json = JSON.parse(res.responseText);
                        } catch (e) {
                            json = res.responseText;
                        }
                        if (successFn) successFn(json);
                    }
                });
            }
        });
    };


    $("#upload").on("click", function () {
        $("#myFile").upload("/uploadFile/", function (success) {
            console.log("success");
        }, function (prog, value) {
            $scope.value = value;
        });
    });

    /*
     var data = $("#myFile").val();
     console.log(data);

     $scope.upload = function(){
     console.log(data);
     $http.post('/uploadFile/', data).success(function(data, status, headers, config) {
     // $scope.courses[$scope.courses.indexOf(course)].name = newName;
     });
     };  */

});
app.controller('FrontOfficeController', ['$scope', '$http', '$timeout', 'classroomFactory', 'teacherFactory', 'courseFactory',
    'promotionFactory', 'scheduleFactory', function ($scope, $http, $timeout, classroomFactory, teacherFactory, courseFactory, promotionFactory, scheduleFactory) {
        var heuresDebut = Array("8:45", "9:45", "11:00", "12:00", "13:45", "14:45", "16:00", "17:00");
        var heuresFin = Array("9:45", "10:45", "12:00", "13:00", "14:45", "15:45", "17:00", "18:00");
        var tree = null;

        $scope.init = function () {
            $scope.initializeTree();
            $scope.defineSchedulerAttachedEvents();
            $scope.configureAndInitializeScheduler();
            $scope.getJsonData(false);
            $scope.populate_comboboxes();
        }

        $scope.initializeTree = function () {
            tree = new dhtmlXTreeObject('treebox_ClassesTree', '100%', '100%', 0);
            //tree.enableAutoTooltips(true);
            tree.enableDragAndDrop(true);
            tree.attachEvent("onDrag", function () {
                return false;
            });
            tree.setImagePath("javascripts/dhtmlx_tree/imgs/csh_yellowbooks/");
            // création de la racine du tree
            // obligatoire pour le bon fonctionnement de l'ajout des childs du tree
            tree.loadJSONObject({id: 0, item: [
                {id: 1, text: "Classes", im0: "tombs.gif", im1: "tombs_open.gif", im2: "tombs.gif"}
            ]});
        }

        $scope.defineSchedulerAttachedEvents = function () {
            scheduler.attachEvent("onTemplatesReady", function () {
                //gestion des event drop depuis le tree (drag&drop)
                scheduler.attachEvent("onExternalDragIn", function (id, source, e) {
                    if (tree.getUserData(tree._dragged[0].id, "tip") == undefined) {
                        return false;
                    }
                    else {
                        var presentEvents = scheduler.getEvents(scheduler.getEvent(id).start_date, scheduler.getEvent(id).end_date);
                        //console.log(d);
                        var teacherName = "";
                        for (var presEv in presentEvents) {
                            if (presEv < (presentEvents.length) - 1) {
                                if (presentEvents[presEv].text.indexOf(tree.getUserData(tree._dragged[0].id, "classroom")) != -1 || presentEvents[presEv].text.indexOf(tree.getUserData(tree._dragged[0].id, "course")) != -1 ||
                                    presentEvents[presEv].text.indexOf(tree.getUserData(tree._dragged[0].id, "teachers")) != -1 || presentEvents[presEv].text.indexOf(tree.getUserData(tree._dragged[0].id, "group")) != -1)
                                //alert("colision");
                                    return false;
                            }
                            else {
                                scheduler.getEvent(id).text = tree.getUserData(tree._dragged[0].id, "tip");
                                scheduler.getEvent(id).color = tree.getUserData(tree._dragged[0].id, "color");
                                scheduler.getEvent(id).start_date.getHours();
                                scheduler.getEvent(id).start_date.getMinutes();
                            }
                        }
                    }
                    return true;
                });

                //gestion du surlignage de la tranche horaire survolée par la souris
                var fix_date = function (date) {  // arrondis 17:48:56 en 17:30:00 par exemple
                    date = new Date(date);
                    if (date.getMinutes() < 15) {
                        date.setMinutes(0);
                    }
                    else {
                        if (date.getMinutes() < 30) {
                            date.setMinutes(15);
                        }
                        else {
                            if (date.getMinutes() < 45) {
                                date.setMinutes(30);
                            }
                            else {
                                date.setMinutes(45);
                            }
                        }
                    }
                    date.setSeconds(0);
                    return date;
                };
                var marked = null;
                var marked_date = null;
                var event_step = 120;
                scheduler.attachEvent("onEmptyClick", function (date, native_event) {
                    scheduler.unmarkTimespan(marked);
                    marked = null;

                    var fixed_date = fix_date(date);
                    scheduler.addEventNow(fixed_date, scheduler.date.add(fixed_date, event_step, "minute"));
                });
                scheduler.attachEvent("onMouseMove", function (event_id, native_event) {
                    var date = scheduler.getActionData(native_event).date;
                    var fixed_date = fix_date(date);
                    if (+fixed_date != +marked_date) {
                        scheduler.unmarkTimespan(marked);
                        marked_date = fixed_date;
                        marked = scheduler.markTimespan({
                            start_date: fixed_date,
                            end_date: scheduler.date.add(fixed_date, event_step, "minute"),
                            css: "highlighted_timespan"
                        });
                    }
                });
            });
        }

        $scope.configureAndInitializeScheduler = function () {
            //paremètres simples
            scheduler.config.first_hour = 8;
            scheduler.config.last_hour = 19;
            scheduler.config.time_step = 15;
            //scheduler.config.cascade_event_display = true;
            //scheduler.config.cascade_event_count = 4;
            //scheduler.config.cascade_event_margin = 30;
            scheduler.config.event_duration = 120;
            scheduler.config.details_on_create = true;
            scheduler.config.details_on_dblclick = true;
            //scheduler.config.readonly = true;
            //scheduler.config.readonly_form = true;
            //scheduler.config.wide_form = false;
            //scheduler.init($element[0], new Date(),"month");
            scheduler.ignore_week = function (date) {
                if (date.getDay() == 6 || date.getDay() == 0) //cache samedi et dimanche
                    return true;
            };
            scheduler.addMarkedTimespan({
                days: [1, 2, 3, 4, 5],                 // de lundi a vendredi
                zones: [0 * 60, 8 * 60 + 45, 18 * 60, 24 * 60],	// de 0h a 8h45	& de 18h a 24h
                type: "dhx_time_block", 			// empèche d'entrer des event pour cette zone
                css: "gray_section"
            });
            scheduler.addMarkedTimespan({
                days: [1, 2, 3, 4, 5],                 // de lundi a vendredi
                zones: [13 * 60, 13 * 60 + 45],			// de 13h a 13h45
                type: "dhx_time_block", 			// empèche d'entrer des event pour cette zone
                css: "red_section"
            });
            scheduler.addMarkedTimespan({
                days: [0, 6],                       // samedi et dimanche
                zones: "fullday",       			// toute la journée
                type: "dhx_time_block", 			// empèche d'entrer des event pour cette zone
                css: "gray_section"
            });
            //scheduler.updateView();
        }

        $scope.getJsonData = function (isFromUser) {
            var requestIsFromUser = isFromUser;

            // récupération des données
            var myGroupJsonString;
            var myTeachersJsonString;
            var myClassroomsJsonString;
            var myCoursesJsonString;
            var myEventListJsonString;


            promotionFactory.findAll().success(function (data, status, headers, config) {
                //$scope.promotions = data;
                myGroupJsonString = JSON.stringify(data);
                console.log("data : " + JSON.stringify(data));
                localStorage.mySavedGroupJSONString = myGroupJsonString;
            });
            teacherFactory.findAll().success(function (data, status, headers, config) {
                //$scope.promotions = data;
                myTeachersJsonString = JSON.stringify(data);
                localStorage.mySavedTeachersJSONString = myTeachersJsonString;
            });
            classroomFactory.findAll().success(function (data, status, headers, config) {
                //$scope.promotions = data;
                myClassroomsJsonString = JSON.stringify(data);
                localStorage.mySavedClassroomsJSONString = myClassroomsJsonString;
            });
            courseFactory.findAll().success(function (data, status, headers, config) {
                //$scope.promotions = data;
                myCoursesJsonString = JSON.stringify(data);
                localStorage.mySavedCoursesJSONString = myCoursesJsonString;
            });
            scheduleFactory.findAll().success(function (data, status, headers, config) {
                //$scope.promotions = data;
                myEventListJsonString = JSON.stringify(data);
                localStorage.mySavedEventListJSONString = myEventListJsonString;
                $scope.initialiseEvents();
            });


            /*if(typeof(Storage)!=="undefined"){
             if (requestIsFromUser){

             var myGroupJsonString;
             var myTeachersJsonString;
             var myClassroomsJsonString;
             var myCoursesJsonString;
             var myEventListJsonString;


             promotionFactory.findAll().success(function (data, status, headers, config) {
             //$scope.promotions = data;
             myGroupJsonString = data;
             });
             teacherFactory.findAll().success(function (data, status, headers, config) {
             //$scope.promotions = data;
             myTeachersJsonString = data;
             });
             classroomFactory.findAll().success(function (data, status, headers, config) {
             //$scope.promotions = data;
             myClassroomsJsonString = data;
             });
             courseFactory.findAll().success(function (data, status, headers, config) {
             //$scope.promotions = data;
             myCoursesJsonString = data;
             });
             scheduleFactory.findAll().success(function (data, status, headers, config) {
             //$scope.promotions = data;
             myEventListJsonString = data;
             initialiseEvents();
             });


             // récupération des données
             var myGroupJsonString = $.getJSON("groupes.json", function() {});
             var myTeachersJsonString = $.getJSON("teachers.json", function() {});
             var myClassroomsJsonString = $.getJSON("classrooms.json", function() {});
             var myCoursesJsonString = $.getJSON("courses.json", function() {});
             var myEventListJsonString = $.getJSON("FullEventsList.json", function() {});

             // callbacks en cas d'erreur
             myGroupJsonString.fail(function(myGroupJsonString, textStatus, error){
             console.log("erreur :" + error.message);
             //INCOMPLET : A FAIRE -> afficher le message d'erreur RED (impossible de mener a bien la requete)
             });
             myTeachersJsonString.fail(function(myTeachersJsonString, textStatus, error){
             console.log("erreur :" + error.message);
             //INCOMPLET : A FAIRE -> afficher le message d'erreur RED (impossible de mener a bien la requete)
             });
             myClassroomsJsonString.fail(function(myClassroomsJsonString, textStatus, error){
             console.log("erreur :" + error.message);
             //INCOMPLET : A FAIRE -> afficher le message d'erreur RED (impossible de mener a bien la requete)
             });
             myCoursesJsonString.fail(function(myCoursesJsonString, textStatus, error){
             console.log("erreur :" + error.message);
             //INCOMPLET : A FAIRE -> afficher le message d'erreur RED (impossible de mener a bien la requete)
             });
             myEventListJsonString.fail(function(myEventListJsonString, textStatus, error){
             console.log("erreur :" + error.message);
             //INCOMPLET : A FAIRE -> afficher le message d'erreur RED (impossible de mener a bien la requete)
             });

             // callbacks quand la requete s'est bien terminée
             myGroupJsonString.done(function(){
             localStorage.mySavedGroupJSONString = myGroupJsonString.responseText;
             //INCOMPLET : A FAIRE -> afficher le message VERT (récupération des données terminée)
             });
             myTeachersJsonString.done(function(){
             localStorage.mySavedTeachersJSONString = myTeachersJsonString.responseText;
             //INCOMPLET : A FAIRE -> afficher le message VERT (récupération des données terminée)
             });
             myClassroomsJsonString.done(function(){
             localStorage.mySavedClassroomsJSONString = myClassroomsJsonString.responseText;
             //INCOMPLET : A FAIRE -> afficher le message VERT (récupération des données terminée)
             });
             myCoursesJsonString.done(function(){
             localStorage.mySavedCoursesJSONString = myCoursesJsonString.responseText;
             //INCOMPLET : A FAIRE -> afficher le message VERT (récupération des données terminée)
             });
             myEventListJsonString.done(function(){
             localStorage.mySavedEventListJSONString = myEventListJsonString.responseText;
             //INCOMPLET : A FAIRE -> afficher le message VERT (récupération des données terminée)
             initialiseEvents();
             });
             }
             else{
             if (!localStorage.mySavedEventListJSONString || !localStorage.myGroupJsonString || !localStorage.myTeachersJsonString || !localStorage.myClassroomsJsonString || !localStorage.myCoursesJsonString){


             // callbacks en cas d'erreur
             myGroupJsonString.fail(function(myGroupJsonString, textStatus, error){
             console.log("erreur :" + error.message);
             //INCOMPLET : A FAIRE -> afficher le message d'erreur RED (impossible de mener a bien la requete)
             });
             myTeachersJsonString.fail(function(myTeachersJsonString, textStatus, error){
             console.log("erreur :" + error.message);
             //INCOMPLET : A FAIRE -> afficher le message d'erreur RED (impossible de mener a bien la requete)
             });
             myClassroomsJsonString.fail(function(myClassroomsJsonString, textStatus, error){
             console.log("erreur :" + error.message);
             //INCOMPLET : A FAIRE -> afficher le message d'erreur RED (impossible de mener a bien la requete)
             });
             myCoursesJsonString.fail(function(myCoursesJsonString, textStatus, error){
             console.log("erreur :" + error.message);
             //INCOMPLET : A FAIRE -> afficher le message d'erreur RED (impossible de mener a bien la requete)
             });
             myEventListJsonString.fail(function(myEventListJsonString, textStatus, error){
             console.log("erreur :" + error.message);
             //INCOMPLET : A FAIRE -> afficher le message d'erreur RED (impossible de mener a bien la requete)
             });

             // callbacks quand la requete s'est bien terminée
             myGroupJsonString.done(function(){
             localStorage.mySavedGroupJSONString = myGroupJsonString.responseText;
             //INCOMPLET : A FAIRE -> afficher le message VERT (récupération des données terminée)
             });
             myTeachersJsonString.done(function(){
             localStorage.mySavedTeachersJSONString = myTeachersJsonString.responseText;
             //INCOMPLET : A FAIRE -> afficher le message VERT (récupération des données terminée)
             });
             myClassroomsJsonString.done(function(){
             localStorage.mySavedClassroomsJSONString = myClassroomsJsonString.responseText;
             //INCOMPLET : A FAIRE -> afficher le message VERT (récupération des données terminée)
             });
             myCoursesJsonString.done(function(){
             localStorage.mySavedCoursesJSONString = myCoursesJsonString.responseText;
             //INCOMPLET : A FAIRE -> afficher le message VERT (récupération des données terminée)
             });
             myEventListJsonString.done(function(){
             localStorage.mySavedEventListJSONString = myEventListJsonString.responseText;
             //INCOMPLET : A FAIRE -> afficher le message VERT (récupération des données terminée)
             initialiseEvents();
             });
             }
             else{
             //INCOMPLET : A FAIRE -> afficher le message ORANGE (La string existe déjà en local)
             }
             }
             }
             else
             {
             //INCOMPLET : A FAIRE -> afficher le message d'erreur RED (Le browser ne supporte pas le webstorage)
             //document.getElementById("result").innerHTML="Sorry, your browser does not support web storage...";
             }     */
        };

        $scope.initialiseEvents = function () {
            //supression des éléments du tree avant de le reconstruire (si il y en a)
            tree.deleteChildItems(1);
            //récupération de la string dans le local storage
            var JsonArray = jQuery.parseJSON(localStorage.mySavedEventListJSONString);
            var jsonGroupsArray = jQuery.parseJSON(localStorage.mySavedGroupJSONString);
            var itmNotNull = 0;
            var nbItmsNotNull = 0;
            //compte le nombre de "modèles" parmis la liste, on en a besoin dans la boucle suivante
            for (var itms in JsonArray) {
                if (new Date(JsonArray[itms].date).getTime() != new Date(0).getTime()) {
                    itmNotNull++;
                }
            }
            //début de la string contenant les event, il faut boucler sur la liste de schedule afin d'en extraire les modèles avant de parser la string
            var eventsString = "[";
            var cptGrp = 11;
            for (var grp in jsonGroupsArray) {
                // ajout des groupes au tree
                tree.insertNewChild(1, cptGrp.toString(), jsonGroupsArray[grp].name, 0, 0, 0, 0, "CHILD");
                var cptCours = 1;
                var idCours = 1;
                for (var itm in JsonArray) {
                    // si la date N'EST PAS null, il s'agit un schedule
                    if (new Date(JsonArray[itm].date).getTime() != new Date(0).getTime()) {
                        if (grp == "0") {
                            eventsString += '{id:"' + JsonArray[itm]._id;														//récupération de l'ID de l'event
                            //récupération du texte de l'event
                            eventsString += '", text:"' + JsonArray[itm].course.name + '<br>' + JsonArray[itm].classroom.name + ' / ' + JsonArray[itm].promotion.name + '<br>';
                            var teacherName = "";
                            if (JsonArray[itm].teachers != null) {
                                var cpt = 0;
                                for (var key in JsonArray[itm].teachers) {
                                    lastname = JsonArray[itm].teachers[key].last_name;
                                    firstname = JsonArray[itm].teachers[key].first_name;
                                    if (cpt >= 1)
                                        teacherName += " - "
                                    teacherName += lastname + " " + firstname.charAt(0).toUpperCase() + ".";
                                    cpt++;
                                }
                                eventsString += teacherName;
                            }
                            else {
                                eventsString += "Autonomie";
                            }
                            var tempDate = new Date(JsonArray[itm].date);
                            var dateWhitoutTime = (tempDate.getMonth() + 1) + '/' + tempDate.getDate() + '/' + tempDate.getFullYear();
                            eventsString += '", start_date:"' + dateWhitoutTime + ' ' + heuresDebut[JsonArray[itm].begin - 1];	//récupération de l'heure de début de l'event
                            eventsString += '", end_date:"' + dateWhitoutTime + ' ' + heuresFin[JsonArray[itm].end - 1];		//récupération de l'heure de fin de l'event
                            eventsString += '", color:"' + JsonArray[itm].color;
                            nbItmsNotNull++;												//récupération de la couleur de l'event
                            if (nbItmsNotNull >= itmNotNull) {
                                eventsString += '"}';
                            }
                            else {
                                eventsString += '"},';
                            }
                            //console.log(eventsString);
                        }
                    }
                    //si la date EST null, il s'agit d'un MODELE de schedule
                    else {
                        if (JsonArray[itm].promotion.name == jsonGroupsArray[grp].name) {
                            var newIdString = cptGrp.toString() + idCours.toString();
                            tree.insertNewChild(cptGrp, newIdString, JsonArray[itm].course.name, 0, 0, 0, 0, "");
                            var teacherName = "";
                            if (JsonArray[itm].teachers != null) {
                                var cpt = 0;
                                for (var key2 in JsonArray[itm].teachers) {
                                    lastname = JsonArray[itm].teachers[key2].last_name;
                                    firstname = JsonArray[itm].teachers[key2].first_name;
                                    if (cpt >= 1) teacherName += " - ";
                                    teacherName += lastname + " " + firstname.charAt(0).toUpperCase() + ".";
                                    cpt++;
                                }
                                tree.setUserData(newIdString, "teachers", teacherName);
                            }
                            else {
                                teacherName += "Autonomie";
                                tree.setUserData(newIdString, "teachers", "NoTeachers");
                            }
                            tree.setUserData(newIdString, "color", JsonArray[itm].color);
                            tree.setUserData(newIdString, "course", JsonArray[itm].course.name);
                            tree.setUserData(newIdString, "group", JsonArray[itm].promotion.name);
                            tree.setUserData(newIdString, "classroom", JsonArray[itm].classroom.name);
                            tree.setUserData(newIdString, "tip", JsonArray[itm].course.name + "<br>" + JsonArray[itm].promotion.name + " / " + JsonArray[itm].classroom.name + "<br>" + teacherName);
                            idCours++;
                        }
                        cptCours++;
                    }
                }
                tree.closeItem(cptGrp);
                cptGrp++;
            }
            eventsString += "]";
            scheduler.parse(eventsString, "json");
        };

        $scope.populate_comboboxes = function () {
            //remplissage des combobox (pour l'option de filtrage)
            var cbx_groups = jQuery.parseJSON(localStorage.mySavedGroupJSONString);
            var cbx_teachers = jQuery.parseJSON(localStorage.mySavedTeachersJSONString);
            var cbx_classrooms = jQuery.parseJSON(localStorage.mySavedClassroomsJSONString);
            var cbx_courses = jQuery.parseJSON(localStorage.mySavedCoursesJSONString);

            $.each(cbx_groups, function (index, value) {
                $("#Groups_Select_data").append('<option value="' + value.name + '">' + value.name + '</option>');
            });
            $.each(cbx_teachers, function (index, value) {
                var teacherName = value.last_name + " " + value.first_name.charAt(0).toUpperCase() + ".";
                $("#Teachers_Select_data").append('<option value="' + teacherName + '">' + teacherName + '</option>');
            });
            $.each(cbx_classrooms, function (index, value) {
                $("#Classrooms_Select_data").append('<option value="' + value.name + '">' + value.name + '</option>');
            });
            $.each(cbx_courses, function (index, value) {
                $("#Courses_Select_data").append('<option value="' + value.name + '">' + value.name + '</option>');
            });
            $scope.show_SelectedFilter(document.getElementById("Main_Select"));
        };

        $scope.test = function () {
            //reload des données
            //supression des éléments du tree avant de le reconstruire
            tree.deleteChildItems(1);
            getJsonData(true);
            //document.getElementById("Groups_Select").className = "combobox_visibile";

        };

        $scope.filters = Array(
            {value: "none", name: "--Filtres--"},
            {value: "Groups_Select", name: "Groupes"},
            {value: "Teachers_Select", name: "Professeurs"},
            {value: "Classrooms_Select", name: "Locaux"},
            {value: "Courses_Select", name: "Cours"});
        $scope.filterChosen = "none";

        $scope.filters = Array(
            {value: "none", name: "--Filtres--"},
            {value: "Groups_Select", name: "Groupes"},
            {value: "Teachers_Select", name: "Professeurs"},
            {value: "Classrooms_Select", name: "Locaux"},
            {value: "Courses_Select", name: "Cours"});
        $scope.filterChosen = "none";

        $scope.show_SelectedFilter = function () {
            var myMaincbx = $scope.filters;
            for (var i = 0; i < myMaincbx.length; i++) {
                console.log(myMaincbx[i]);
                if (myMaincbx[i].value != "none") {
                    if (myMaincbx[i].value == $scope.filterChosen)
                        document.getElementById(myMaincbx[i].value).className = "combobox_visibile";
                    else
                        document.getElementById(myMaincbx[i].value).className = "combobox_hidden";
                }
            }
        };

        $scope.Filter_schedules = function () {
            var mainBox = document.getElementById("Main_Select").options[document.getElementById("Main_Select").selectedIndex].value;
            if (mainBox != "none") {
                var selectedBox = document.getElementById(mainBox + "_data").options[document.getElementById(mainBox + "_data").selectedIndex].value;
                // on vide le scheduler
                scheduler.clearAll();
                //on le reremplit avec les données filtrées
                var JsonArrayFilter = jQuery.parseJSON(localStorage.mySavedEventListJSONString);
                var itmNotNull = 0;
                var nbItmsNotNull = 0;
                //compte le nombre de "modèles" parmis la liste, on en a besoin dans la boucle suivante
                for (var itms in JsonArrayFilter) {
                    if (JsonArrayFilter[itms].date != null) itmNotNull++;
                }
                //début de la string contenant les event, il faut boucler sur la liste de schedule afin d'en extraire les modèles avant de parser la string
                var eventsString = "[";
                for (var itm in JsonArrayFilter) {
                    // si la date N'EST PAS null, il s'agit un schedule
                    if (JsonArrayFilter[itm].date != null) {
                        console.log(JsonArrayFilter[itm]);
                        //traitement du nom du professeur avant la condition (obligatoire pour le bon traitement)
                        var teacherName = "";
                        if (JsonArrayFilter[itm].teachers != null) {
                            var cpt = 0;
                            for (var key in JsonArrayFilter[itm].teachers) {
                                lastname = JsonArrayFilter[itm].teachers[key].last_name;
                                firstname = JsonArrayFilter[itm].teachers[key].first_name;
                                if (cpt >= 1)
                                    teacherName += " - "
                                teacherName += lastname + " " + firstname.charAt(0).toUpperCase() + ".";
                                cpt++;
                            }
                        }
                        else {
                            teacherName += "Autonomie";
                        }

                        if (JsonArrayFilter[itm].promotion.name == selectedBox || JsonArrayFilter[itm].classroom.name == selectedBox || JsonArrayFilter[itm].course.name == selectedBox || teacherName == selectedBox) {
                            eventsString += '{id:"' + JsonArrayFilter[itm]._id;														//récupération de l'ID de l'event
                            //récupération du texte de l'event
                            eventsString += '", text:"' + JsonArrayFilter[itm].course.name + '<br>' + JsonArrayFilter[itm].classroom.name + ' / ' + JsonArrayFilter[itm].promotion.name + '<br>' + teacherName;
                            var tempDate = new Date(JsonArrayFilter[itm].date);
                            var dateWhitoutTime = (tempDate.getMonth() + 1) + '/' + tempDate.getDate() + '/' + tempDate.getFullYear();
                            eventsString += '", start_date:"' + dateWhitoutTime + ' ' + heuresDebut[JsonArrayFilter[itm].begin - 1];	//récupération de l'heure de début de l'event
                            eventsString += '", end_date:"' + dateWhitoutTime + ' ' + heuresFin[JsonArrayFilter[itm].end - 1];		//récupération de l'heure de fin de l'event
                            eventsString += '", color:"' + JsonArrayFilter[itm].color;
                            nbItmsNotNull++;												//récupération de la couleur de l'event
                            if (nbItmsNotNull >= itmNotNull) {
                                eventsString += '"}';
                            }
                            else {
                                eventsString += '"},';
                            }
                            //console.log(eventsString);
                        }
                    }
                }
                eventsString += "]";
                scheduler.parse(eventsString, "json");
                console.log(selectedBox);
            }
            else {
                initialiseEvents();
            }
        };


        $(function () {
            // Setup drop down menu
            $('.dropdown-toggle').dropdown();

            // Fix input element click problem
            $('.dropdown input, .dropdown label').click(function (e) {
                e.stopPropagation();
            });
        });
    }]);

app.directive('dhxScheduler', function () {
    return {
        restrict: 'A',
        scope: false,
        transclude: true,
        template: '<div class="dhx_cal_navline" ng-transclude></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div>',

        link: function ($scope, $element, $attrs, $controller) {
            //adjust size of a scheduler
            $scope.$watch(function () {
                return $element[0].offsetWidth + "." + $element[0].offsetHeight;
            }, function () {
                scheduler.setCurrentView();
            });

            //styling for dhtmlx scheduler
            $element.addClass("dhx_cal_container");

            //init scheduler
            console.log("directive");
            scheduler.init($element[0], new Date(), "week");
        }
    };
});