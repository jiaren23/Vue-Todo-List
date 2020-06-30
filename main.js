var app = new Vue({
    el: '#app',
    data: {
        newTodo: '',  // input 輸入框 (欲鍵入的代辦內容)
        todos: [      // 陳列代辦事項 內容的地方
            // {
            //     id: '23', // 代辦事項的 title與checkbox 如果要互相綁定要給 id 
            //     title: '測試項目',         // 代辦內容
            //     completed: false   // 是否完成
            // },
        ],
        cacheTodo:{},         // 暫存 欲編輯項目的地方
        cacheTitle : '',      // 暫存 欲編輯 標題的地方  ( 另外載存 title 用意是為了拿它來當作 編輯時 要顯示的內容 )
        visibility: 'all'     // 切換頁嵌 (全部、進行中、已完成)
    },
    methods: {                // 將input 輸入的 資料加到 代辦清單列表
        /* 取出 輸入的代辦內容，再製作一個 id (使用當下時間) 並透過 Math.floor 將取出的時間轉化為數字*/
        addTodo: function () {
            let value = this.newTodo.trim();     // .trim 用以去除前後多餘的空白
            let timeStamp = Math.floor(Date.now());
            console.log(value, timeStamp);
            if (!value) return;                  // 空值就不動作
            this.todos.push({                    // 將以上兩筆資料、預設completed => todos
                id: timeStamp,
                title: value,
                completed: false
            });
            this.newTodo = "";                  // 推完資料後清空
        },
        removeTodo: function (todoThis) {       // 透過索引位置 刪除欲刪除的<li>
            let newIndex = '';                  // 預設一空的值 等等來賦予索引位置
            let vmThis = this;
            vmThis.todos.forEach((item,index)=>{ 
                if(todoThis.id === item.id){    // 這裡進行比對我要刪除的項目 id 與 todos id 相符後 才可以刪除
                    newIndex = index;           // 如果相符就把 索引位置取出來 並存進剛定義好的空殼 newIndex 
                }
            })
            this.todos.splice(newIndex, 1)      // 根據 最後的索引位置 刪除該項 項目
        },
        editTodo : function(item){              // 編輯 todo 的 function 
            console.log(item)
            this.cacheTodo = item ;             // 先把 item (todos) 的內容都先存到 cache 
            this.cacheTitle = item.title ;      // 把 title 存到 cache title  
        },
        cancelEdit : function(){                // 取消編輯 
            this.cacheTodo = {}                 //   只要把原本內容又換成 空物件即可
        },
        enterEdit : function(item){
            item.title =  this.cacheTitle; 
            this.cacheTitle = '';               // 清空 暫存標題
            this.cacheTodo = {};
        },
        clearAll: function(item){
            this.todos=[];
        }

    },
    computed: {
        filteredTodos: function () {
            if (this.visibility == 'all') {
                return this.todos;
            } else if (this.visibility == 'still') {
                let stillTodos = [];
                this.todos.forEach((item) => {
                    if (!item.completed) {
                        stillTodos.push(item);
                    }
                })
                return stillTodos
            } else {
                let compltedTodos = [];
                this.todos.forEach((item) => {
                    if (item.completed) {
                        compltedTodos.push(item);
                    }
                })
                return compltedTodos
            }
        },
        workTodo: function () {
            let itemnum = 0;
            this.todos.forEach(function (item) {
              if (!item.completed) {
                itemnum ++;
              }
            })
            return itemnum;
          }
    }
});
