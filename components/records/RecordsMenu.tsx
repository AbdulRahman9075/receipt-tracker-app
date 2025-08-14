import {useState,useCallback } from 'react';
import { View,StyleSheet, Animated} from 'react-native';
import { Searchbar ,IconButton,Button, Menu, Divider} from 'react-native-paper';
import { debounce } from 'lodash';
import FilterModal from './filterModal';
import ConfirmationModal from '../confirmationModal';
import { clearData} from '../../utils/manageDatabase';
import { useAccount } from '../../accountContext';

type RecordsMenuProps = {
  reload: () => void;
  filter: (filters: any) => void;
  search: (query: string) => void;

};

export default function RecordsMenu(
    { reload,filter,search}: RecordsMenuProps,
) {

    const { accountId, setAccountId } = useAccount();
    const [searchQuery, setSearchQuery] = useState('');

    //filter modal
    const [filterVisible, setFilterVisible] = useState(false);
    const openFilterModal = () => setFilterVisible(true);
    const closeFilterModal = () => setFilterVisible(false);


    // delete modal
    const [deleteVisible, setDeleteVisible] = useState(false);
    const openDeleteModal = () => setDeleteVisible(true);
    const closeDeleteModal = () => setDeleteVisible(false);

    const handleDelete = async () => {
        await clearData(accountId);
        reload();
    };

    const [filters, setFilters] = useState({});
    const handleApplyFilters = (filterValues: any) => {
        console.log('Applied Filters:', filterValues);
        setFilters(filterValues);
        filter(filterValues);
    };

     const debouncedSearch = useCallback(
        debounce((text: string) => {
        search(text); // calls the parent handler
        console.log("Applied Search", text);
        }, 1000),
        [] // ensure this doesn't get recreated on every render
    );


    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        debouncedSearch(query.trim()); 

    };

    const DropDown = () => {
        const [visible, setVisible] = useState(false);
        const openMenu = () => setVisible(true);
        const closeMenu = () => setVisible(false);
    return (
        <View
        style={{

        }}
        >
        <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
            <IconButton
                icon="dots-vertical"
                size={30}
                style={styles.optionsbutton}
                onPress={openMenu}
                accessibilityLabel="options"
            />
            }
        >
            <Menu.Item onPress={openDeleteModal} title="Delete All Data" />
            <Divider />
            <Menu.Item onPress={openFilterModal} title="Filter" />
            <Divider />
            <Menu.Item onPress={reload} title="Remove Filters" />
        </Menu>
        </View>
    );
    };
    return (
        <View>
        <Searchbar
            placeholder="Search Item"
            onChangeText={handleSearch}
            value={searchQuery}
            style={styles.searchbutton}
            elevation={2}
        />
        <DropDown/>
        <FilterModal visible={filterVisible} onDismiss={closeFilterModal} onApplyFilters={handleApplyFilters} />
        <ConfirmationModal 
            visible={deleteVisible} 
            yesButtonText='Delete' 
            message='This action is not reversable. Are you sure?'
            onDismiss={closeDeleteModal}
            onConfirm={handleDelete}
        />
        </View>
    )
}

const styles = StyleSheet.create({

searchbutton: {
    maxWidth: "90%",
    position: 'relative',
  },
optionsbutton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    position: 'relative',
    top: -50,
    left: 325,

}
})