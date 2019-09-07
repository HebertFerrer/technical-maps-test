<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item @click>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click>
          <v-list-item-action>
            <v-icon>mdi-contact-mail</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Contact</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="indigo" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Geolocalización</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <GmapMap class="map" :center="{lat:10, lng:10}" :zoom="7" map-type-id="terrain">
        <GmapMarker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :clickable="true"
          :draggable="true"
          @click="center=m.position"
        />
      </GmapMap>
      <Form></Form>

    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>



  </v-app>
</template>

<script>
import Form from '@/components/Form';

export default {
  props: {
    source: String
  },

  data: () => ({
    drawer: null,
    markers: [{ position: { lat: 10.0, lng: 10.0 } }]
  }),

  components: {
    Form,
  }

};
</script>

<style scoope>
.map {
  width: 100%;
  height: 100%;
}
</style>