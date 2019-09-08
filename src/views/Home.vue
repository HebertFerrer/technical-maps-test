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
      <GmapMap class="map" :center="{lat:10, lng:10}" :zoom="7" ref="mapRef" map-type-id="terrain">
        <gmapInfoWindow
          :options="info.options"
          :position="info.position"
          :opened="info.opened"
          @closeclick="info.opened=false"
        >
          <p>
            <strong>Descripción:</strong>
            {{info.data.description}}
          </p>
          <p>
            <strong>Dirección:</strong>
            {{info.data.direction}}
          </p>
          <p>
            <strong>Teléfono:</strong>
            {{info.data.cellphone}}
          </p>
          <p>
            <strong>(X, Y):</strong>
            {{info.data.coordinates.lng}} - {{info.data.coordinates.lat}}
          </p>
          <p>
            <strong>Categoría:</strong>
            {{info.data.category}}
          </p>
          <v-btn color="red lighten-1" x-small text @click="openEraseDialog">Eliminar</v-btn>
          <v-btn
           color="yellow darken-4"
           x-small
           text
           @click="openModify(info.currentKey)"
          >Modificar</v-btn>
        </gmapInfoWindow>
        <GmapMarker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.coordinates"
          :clickable="true"
          @click="toggleInfo(m, index)"
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
            <v-form ref="form" v-model="valid">
              <v-row>
                <!-- Description -->
                <v-col cols="12">
                  <v-text-field
                    label="Descripción*"
                    v-model="form.description"
                    required
                    counter
                    maxlength="100"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <!-- Direction -->
                <v-col cols="12">
                  <v-text-field
                    label="Dirección*"
                    v-model="form.direction"
                    hint="ej: Av. Eduardo Madero 1020, C1001 CABA"
                    :rules="[rules.required]"
                    counter
                    maxlength="100"
                  ></v-text-field>
                </v-col>
                <!-- Cellphone -->
                <v-col cols="12">
                  <v-text-field
                    v-mask="cellphoneMask"
                    v-model="form.cellphone"
                    label="Teléfono*"
                    hint="ej: 54 9 11 5272 0900"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <!-- Category -->
                <v-col class="d-flex" cols="12">
                  <v-select
                   :items="items"
                   label="Categoría*"
                   v-model="form.category"
                   :rules="[rules.required]"
                  ></v-select>
                </v-col>
                <!-- Coordinates -->
                <v-col cols="12">
                  <p class="title text-center">Coordenadas</p>
                </v-col>
                <!-- X -->
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Longitud*"
                    required
                    hint="ej: 100.23"
                    v-model.number="form.coordinates.lng"
                    :rules="[rules.required, rules.number, rules.coordinatesX]"
                  ></v-text-field>
                </v-col>
                <!-- Y -->
                <v-col cols="12" sm="6">
                  <v-text-field
                    label="Latitud*"
                    required
                    v-model.number="form.coordinates.lat"
                    :rules="[rules.required, rules.number, rules.coordinatesY]"
                    hint="ej: 23.43"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
          <small>*Indica los campos obligatorios</small>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="red lighten-1" text @click="close">Cerrar</v-btn>
          <v-btn color="indigo darken-1" text @click="submit" :disabled="!valid">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Erase dialog -->
    <template>
      <v-dialog v-model="eraseDialog" max-width="290">
        <v-card>
          <v-card-title class="headline">Use Google's location service?</v-card-title>

          <v-card-text>
            ¿Estas seguro que quieres eliminar este marcador?
          </v-card-text>

          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="green darken-1" text @click="eraseDialog = false">Cancelar</v-btn>
            <v-btn color="green darken-1" text @click="erase">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </v-app>
</template>


    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  // props: {
  //   source: String
  // },

  data: () => ({
    drawer: null,
    markers: [],
    dialog: false,
    eraseDialog: false,
    cellphoneMask: "(###) ####-####",

    isModify: false,

    items: ["Comercial", "Residencial", "Mixta"],

    // Validations
    valid: true,
    rules: {
      required: value => !!value || "Campo requerido",
      coordinatesX: value =>
        (value < 180 && value > -180) ||
        "El valor no debe ser mayor a 180 ni menor a -180",
      coordinatesY: value =>
        (value < 90 && value > -90) ||
        "El valor no debe ser mayor a 90 ni menor a -90",
      number: value =>
        /^[0-9]+(\.[0-9]+)?$/g.test(value) ||
        "El valor debe ser numerico"
    },

    form: {
      description: "",
      direction: "",
      cellphone: "",
      category: "",
      coordinates: {
        lng: null,
        lat: null
      }
    },

    info: {
      // data in window
      data: {
        description: "",
        direction: "",
        cellphone: "",
        category: "",
        coordinates: {
          lng: null,
          lat: null
        }
      },
      // functionality
      position: null,
      content: null,
      opened: false,
      currentKey: null,
      options: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      }
    }
  }),

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        if (this.isModify) {
          this.modify();
        } else {
          this.create();
        }
      }
    },

    create() {
      this.markers.push({
        description: this.form.description,
        direction: this.form.direction,
        cellphone: this.form.cellphone,
        category: this.form.category,
        coordinates: {
          lng: this.form.coordinates.lng,
          lat: this.form.coordinates.lat
        }
      });
      localStorage.setItem("markers", JSON.stringify(this.markers));
      this.$refs.form.reset();
      this.dialog = false;
    },

    erase() {
      let index = this.info.currentKey;
      this.info.opened = false;
      this.markers.splice(index, 1);
      localStorage.setItem("markers", JSON.stringify(this.markers));
      this.eraseDialog = false;
    },

    openEraseDialog() {
      this.eraseDialog = true;
    },

    modify() {
      let index = this.info.currentKey;
      this.fillMarkerData(index);
      localStorage.setItem("markers", JSON.stringify(this.markers));
      this.$refs.form.reset();
      this.dialog = false;
    },

    openModify(index) {
      this.info.opened = false;
      this.isModify = true;
      this.fillFormData(index);
      this.dialog = true;
    },

    getPosition: function(marker) {
      return {
        lat: parseFloat(marker.coordinates.lat),
        lng: parseFloat(marker.coordinates.lng)
      };
    },

    toggleInfo: function(marker, key) {
      this.info.position = this.getPosition(marker);
      this.info.data = marker;
      // Open or close
      if (this.info.currentKey == key) {
        this.info.opened = !this.info.opened;
      } else {
        this.info.opened = true;
        this.info.currentKey = key;
      }
    },

    close() {
      this.dialog = false;
      this.$refs.form.reset()
    },

    fillFormData(index) {
      this.form.description = this.markers[index].description;
      this.form.direction = this.markers[index].direction;
      this.form.cellphone = this.markers[index].cellphone;
      this.form.category = this.markers[index].category;
      this.form.coordinates.lng = this.markers[index].coordinates.lng;
      this.form.coordinates.lat = this.markers[index].coordinates.lat;
    },

    fillMarkerData(index) {
      this.markers[index].description = this.form.description;
      this.markers[index].direction = this.form.direction;
      this.markers[index].cellphone = this.form.cellphone;
      this.markers[index].category = this.form.category;
      this.markers[index].coordinates.lng = this.form.coordinates.lng;
      this.markers[index].coordinates.lat = this.form.coordinates.lat;
    },

    consola() {
      console.log(this.markers[this.info.currentKey].description);
    }
  },

  mounted() {
    let data = JSON.parse(localStorage.getItem("markers"));
    this.$refs.mapRef.$mapPromise.then(map => {
      // map is loaded now
      data === null ? (this.markers = []) : (this.markers = data);
    });
  }
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