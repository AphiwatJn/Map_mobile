import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Menu, PaperProvider } from "react-native-paper";

export default function SelectValue({ limit, fillerData }) {
  const [visible, setVisible] = React.useState(false);
  const [selectedTitle, setSelectedTitle] = React.useState("สูงสุด"); // Default title

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const hdlSelect = (title, count) => {
    setSelectedTitle(title);  
    fillerData(count);       
    closeMenu();
  };

  return (
    <View style={styles.Section}>
      <PaperProvider>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Button
                onPress={openMenu}
                style={styles.menuButton}
                labelStyle={styles.buttonText}
              >
                แสดงผลข้อมูล(จุด) : {selectedTitle}
              </Button>
            }
            style={styles.SectionText}
          >
            <Menu.Item
              onPress={() => hdlSelect("10", 10)}
              title="10"
            />
            <Menu.Item
              onPress={() => hdlSelect("100", 100)}
              title="100"
            />
            <Menu.Item
              onPress={() => hdlSelect("1000", 1000)}
              title="1000"
            />
            <Menu.Item
              onPress={() => hdlSelect("สูงสุด", null)}
              title="สูงสุด"
            />
          </Menu>
        </View>
      </PaperProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  Section: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  menuButton: {
    backgroundColor: "#4267b2",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
