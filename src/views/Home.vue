<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list dense>
        <v-list-item @click="dialog = !dialog">
          <v-list-item-action>
            <v-icon>add_circle</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Agregar</v-list-item-title>
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
      <Form :dialog="dialog" />
    </v-content>

    <!-- Form -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title class="card-title">
          <span class="headline">Rellene la información</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Descripción*"
                  required
                  counter
                  maxlength="100"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  label="Dirección*"
                  hint="ej: Av. Eduardo Madero 1020, C1001 CABA"
                  :rules="[rules.required]"
                  counter
                  maxlength="100"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-mask="cellphone" label="Teléfono*" hint="ej: 54 9 11 5272 0900"></v-text-field>
              </v-col>
              <v-col cols="12">
                <p class="title text-center">Coordenadas</p>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-mask="coordinates"
                  label="X*"
                  required
                  :rules="[rules.required, rules.coordinates_x]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-mask="coordinates" label="Y*" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                  label="Interests"
                  multiple
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
          <small>*Indica los campos obligatorios</small>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },

  data: () => ({
    drawer: null,
    markers: [{ position: { lat: 10.0, lng: 10.0 } }],
    dialog: false,
    cellphone: '####-####',
    coordinates: '###.##' || '##.##' || '#.##',

    // Validations
    rules: {
      required: value => !!value || 'Campo requerido',
      coordinates_x: value => value < 180 && value > -180
      || 'El valor no debe ser mayor a 179.99 ni menor a -179.99',
      coordinates_y: value => value < 90 && value > -90
      || 'El valor no debe ser mayor a 89.99 ni menor a -89.99',

    }
  })
};
</script>

<style scoope>
.map {
  width: 100%;
  height: 100%;
}
.card-title {
  background-color: #3f51b5;
  color: white;
}
</style>