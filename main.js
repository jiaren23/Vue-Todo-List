var app = new Vue({
    el: '#app',
    data: {
        newTodo: '',  // input 輸入框 (欲鍵入的代辦內容)
        todos: JSON.parse(localStorage.getItem('todoList')) || [],
     // [      // 陳列代辦事項 內容的地方
            // {
            //     id: '23', // 代辦事項的 title與checkbox 如果要互相綁定要給 id 
            //     title: '測試項目',         // 代辦內容
            //     completed: false   // 是否完成
            // },
     //   ],
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
            if (!value) return; //(value === "") // 空值就不動作
            this.todos.push({                    // 將以上兩筆資料、預設completed => todos
                id: timeStamp,
                title: value,
                completed: false
            });
            this.newTodo = "";                  // 推完資料後清空
            this.storageHandler()
        },
        removeTodo : function (todoFrom_V_For_Item) {       // 透過索引位置 刪除欲刪除的<li>
        /*   原先只要判斷  this.todos.splice(key,1); 即可
             但是經過 visibility 的切換後將導致 索引位置亂掉 , 
             因此刪除的索引依據 要根據 item 本身的 id 做判斷後 再 指出索引 */
            let newIndex = '';                  // 這裡創建一個新的 空 索引位置
            this.todos.forEach((todosFromAboveData,index)=>{ // 這裡有個關鍵 , 我不管 all still complete 這個項內容是什麼 , 就是直接針對 all 來做遍歷 this.todos.forEach 
                if(todoFrom_V_For_Item.id === todosFromAboveData.id ){ // 在這裡進行判斷 如果 我 用 v-for 渲染的 item.id  ===  上方資料的 todos.id
                    newIndex = index;                   // 就把當下的 索引位置 賦予給 新的索引位置
                }
            })
            this.todos.splice(newIndex, 1)      // 根據 最後的索引位置 刪除該項 項目
            this.storageHandler()
        },
        editTodo : function(todoFrom_V_For_Item){              // 編輯 todo 的 function 
            console.log(todoFrom_V_For_Item)
            this.cacheTodo = todoFrom_V_For_Item ;             // 先把 item (todos) 的內容都先存到 cache 
            this.cacheTitle = todoFrom_V_For_Item.title ;      // 把 title 存到 cache title  
            this.storageHandler()
        },
        cancelEdit : function(){                // 取消編輯 
            this.cacheTodo = {}                 // 要把原本內容又換成 空物件即可 & 恢復畫面 使其離開 input 的 layout 
        },
        enterEdit : function(todoFrom_V_For_Item){  // enter 鍵入輸入的內容
            todoFrom_V_For_Item.title =  this.cacheTitle;      // 按下 enter 後 將輸入值賦予 itemtitle
            this.cacheTitle = '';               // 再把 cache title 清空 
            this.cacheTodo = {};                // 恢復畫面 使其離開 input 的 layout 
            this.storageHandler()
        },
        clearAll : function(){
            this.todos=[];
            this.storageHandler()
        },
        storageHandler(){                       // localStorage
            localStorage.setItem('todoList', JSON.stringify(this.todos))
        }
    },
    computed: {                                 // 切換資料狀態 (過濾資料)
        filteredTodos: function () {
            if (this.visibility == 'all') {
                return this.todos;
            } else if (this.visibility == 'still') {
                let stillTodos = [];           // 創建一空的 進行中 todos
                this.todos.forEach((item) => {
                    if (!item.completed) {     // (item.completed === false) 如果遍歷到該todos 的 completed = false (未完成)
                        stillTodos.push(item); // 就推該項 todos 進去 進行中  
                    }
                })
                return stillTodos;
            } else if (this.visibility == 'completed'){
                let completedTodos = [];
                this.todos.forEach((item)=>{
                    if(item.completed === true){       // (item.completed === true)
                        completedTodos.push(item)
                    }
                })
                return completedTodos;
            }
        },
        workTodo: function () {
            let notComplete = 0;
            this.todos.forEach(function (item) {
              if (!item.completed) {         // (item.completed == false)
                notComplete ++;
              }
            })
            return notComplete;
          }
    }
});
