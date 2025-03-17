// import React, { useState } from 'react';

// import {
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// import AirlineTicket from './AirlineTicket';
// import BusTicket from './BusTicket';

// const Vehicle = () => {
//   const [selectedTab, setSelectedTab] = useState("bus");

//   return (
//     <View style={styles.container}>
//       <Image source={{ uri: "https://i.pinimg.com/736x/04/9f/7e/049f7e527c460a082e3ae3f46f026ada.jpg" }} style={styles.image} />
//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[styles.tab, selectedTab === "airline" && styles.activeTab]}
//           onPress={() => setSelectedTab("airline")}
//         >
//           <Text style={[styles.tabText, selectedTab === "airline" && styles.activeText]}>
//             ✈️ Vé máy bay
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tab, selectedTab === "bus" && styles.activeTab]}
//           onPress={() => setSelectedTab("bus")}
//         >
//           <Text style={[styles.tabText, selectedTab === "bus" && styles.activeText]}>
//             🚌 Vé xe khách
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {selectedTab === "airline" ? <AirlineTicket /> : <BusTicket />}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   image: { width: "100%", height: 230, resizeMode: "cover" },
//   tabContainer: { flexDirection: "row", justifyContent: "center", marginVertical: 10 },
//   tab: {
//     flex: 1,
//     padding: 10,
//     alignItems: "center",
//     borderBottomWidth: 2,
//     borderColor: "#ccc",
//   },
//   activeTab: { borderColor: "green", backgroundColor: "#e0f2e9" },
//   tabText: { fontSize: 16, color: "#555" },
//   activeText: { fontWeight: "bold", color: "green" },
// });

// export default Vehicle;

import React from 'react';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const Vehicle = () => {
  return (
    <View>
      <Text>Vehicle</Text>
    </View>
  )
}

export default Vehicle

const styles = StyleSheet.create({})