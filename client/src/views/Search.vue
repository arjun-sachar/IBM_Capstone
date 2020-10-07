<template>
 <div id = "SearchPage">
    <h1> SEARCH PAGE </h1>
    <input type="text" v-model="search" placeholder="Search Books" />
    <div v-for="jsonData in filteredBooks" class = "single-book">
        <h2> {{jsonData.title | to-uppercase}} </h2>
        <p> {{jsonData.description | shorten}} </p>
    </div>
 </div>
</template>

<script>
import WidgetList from "@/components/WidgetList";
import DataService from '@/services/DataService'


export default {
    
    // <ul>
    //         <li v-for="jsonData in dataPackage.results"> 
    //             <div>
    //            {{jsonData.title}} 
    //             </div>
    //         </li>
    //     </ul>
    name: "SearchPage",
 
    
    data () {
        return {
            message: "My message",
            dataPackage: [],
            books: [],
            search: ''
        };
    },
    
    async mounted() {
        
        DataService.getApiData().then(r => {
            this.dataPackage = r.data;
            this.books = dataPackage.results
        })
       
        
       // console.log(this.dataPackage);
    },

    computed: {
        filteredBooks: function(){
            return this.books.filter((book) => {
                return book.title.match(this.search);
            } )
        }
    }

    
};



</script>

    
<style>

#SearchPage{
    max-width: 800px;
    margin: 0 auto;
}
.single-book{
    padding: 20px;
    margin: 20px;
    box-sizing: border-box;
    max-width: 200px;
    background:#eee;
}

</style>