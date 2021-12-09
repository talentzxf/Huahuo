<template>
  <DraggablePanel>
    <DraggableItem title="ObjectExplorer">
      Object explorer content
    </DraggableItem>
    <DraggableItem title="ViewArea">
      <div>
        This is view area!!!
      </div>
    </DraggableItem>
  </DraggablePanel>
  <DraggablePanel>
    <DraggableItem title="Inspector">
      Inspector content
    </DraggableItem>
  </DraggablePanel>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import DraggablePanel from './components/DraggableComponents/DraggablePanel.vue';
import DraggableItem from './components/DraggableComponents/DraggableItem.vue';

@Options({
  components: {
    DraggablePanel,
    DraggableItem
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
