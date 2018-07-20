import {mapGetters} from 'vuex'

export const playlistMixins={
    methods: {
        heightHandle(){
            throw new Error("对应的组件中需要有这个方法。")
        }
    },
    mounted () {
        
        if(this.playlist.length){
            this.heightHandle(this.playlist);
        }
    },
    activated () {
        if(this.playlist.length){
            this.heightHandle(this.playlist);
        }
    },
    watch: {
        playlist(newy){
            this.heightHandle(newy);
        }
    },
    computed: {
        ...mapGetters([
            'playlist'
        ])
    }
}