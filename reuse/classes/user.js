this.new_user = class user {
    constructor(id) {
        this.id = id
    }

    criar(){
        let data = {
            [`${this.id}`]:{
                "profile":{

                },
                "configs":{
                    
                },
                "gamedata":{

                }
            }
        }
        return data
    }
}