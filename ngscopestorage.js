/**
 * An Angular module that binds $scope to the browser storage.
 * @name ngScopeStorage
 * @version v1.0.0 - 03-10-2015
 * @link https://github.com/rannn505/ngScopeStorage
 * @author rannn505 <rannn505@outlook.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

(function (window, angular) {
    'use strict';

    var MODULE_NAME = 'ngScopeStorage';

    var app = angular.module('ngScopeStorage', []);

    app.provider('$vms', _vms);

    function _vms () {

        /*required*/
        var _scope = null;
        var _ctrlName = null;

        /*optional*/
        var _prefix = 'vms';
        var _storageType = 'localStorage';
        var _onReload = 'empty';

        /*module_vars*/
        var _storage = window[_storageType];

        /*setters*/
        function set_scope(scope) {
            if (typeof scope !== 'object') {
                throw new TypeError( MODULE_NAME + '- set_scope must get a object.');
            }
            if (!scope && !angular.isDefined(scope)){
                throw new SyntaxError( MODULE_NAME + '- set_scope must get a value');
            }
            _scope = scope;
        }

        function set_ctrlName(ctrl) {
            if (typeof ctrl !== 'string') {
                throw new TypeError( MODULE_NAME + '- set_ctrlName must get a string.');
            }
            if (!ctrl && !angular.isDefined(ctrl)){
                throw new SyntaxError( MODULE_NAME + '- set_ctrlName must get a value');
            }
            _ctrlName = ctrl;
        }

        function set_prefix(pre) {
            if (typeof pre !== 'string') {
                throw new TypeError( MODULE_NAME + '- set_prefix must get a string.');
            }
            if (pre === ''){
                throw new SyntaxError( MODULE_NAME + '- set_prefix must`nt get an empty string');
            }
            _prefix = pre;
        }

        function set_storageType(st) {
            if (typeof st !== 'string') {
                throw new TypeError( MODULE_NAME + '- set_storageType must get a string.');
            }
            if (st === ''){
                throw new SyntaxError( MODULE_NAME + '- set_storageType must`nt get an empty string');
            }
            if(st !== 'localstorage' && st !== 'sessionStorage'){
                throw new SyntaxError( MODULE_NAME + '- set_storageType got an invalid string');
            }
            _storageType = st;
            _storage = window[_storageType];
        }

        function set_onReload(onr) {
            if (typeof onr !== 'string') {
                throw new TypeError( MODULE_NAME + '- set_onReload must get a string.');
            }
            if (onr === ''){
                throw new SyntaxError( MODULE_NAME + '- set_onReload must`nt get an empty string');
            }
            if(onr !== 'save' && onr !== 'empty'){
                throw new SyntaxError( MODULE_NAME + '- set_onReload got an invalid string');
            }
            _onReload = onr;
        }


        /*cleaners*/
        function clean_storage(_storage){
            for (var e in _storage) {
                //console.log(e);
                if(e.indexOf(_prefix) != -1 || e.indexOf(_ctrlName)){
                    _storage.removeItem(e);
                }
            }
        }

        this.$get = [function () {

            var _$vms = {};

            _$vms.config = function(settingsObj){

                set_scope(settingsObj.scope);
                set_ctrlName(settingsObj.ctrlName);

                if(angular.isDefined(settingsObj.prefix)){set_prefix(settingsObj.prefix)}
                if(angular.isDefined(settingsObj.storageType)){set_storageType(settingsObj.storageType)}
                if(angular.isDefined(settingsObj.onReload)){set_onReload(settingsObj.onReload)}

                init();
            };

            function init(){

                var handler;

                if(_onReload == 'empty') {
                    clean_storage(_storage);
                    handler = function(changes) {  empty_binder(changes); };
                }
                else{
                    handler = function(changes) {  save_binder(changes); };
                }

                _$vms.prefix =_prefix+':'+_ctrlName+'::';
                Object.observe(_$vms,handler);
            }

            function save_binder (keys){
                //console.log("save");
                keys.forEach(function (e) {
                    var name = e.name;
                    _scope[name] = e.object[name];

                    if(e.type == "add") {
                        if(!_storage.getItem(_prefix+':'+_ctrlName+'::'+name)){
                            _storage.setItem(_prefix+':'+_ctrlName+'::'+name , _scope[name]);
                        }
                    }
                    else{
                        _storage.setItem(_prefix+':'+_ctrlName+'::'+name , _scope[name]);
                    }
                });
                _scope.$apply();
            }
            function empty_binder (keys){
                //console.log("empty");
                keys.forEach(function (e) {
                    var name = e.name;
                    _scope[name] = e.object[name];
                    _storage.setItem(_prefix+':'+_ctrlName+'::'+name , _scope[name]);
                });
                _scope.$apply();
            }

            return _$vms;
        }];
    }
})(window, window.angular);