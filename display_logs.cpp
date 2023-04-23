#include <fstream>
#include <iostream>
#include <stack>
#include <queue>
#include <list>
#include <cstring>

#include <sys/types.h>
#include <sys/stat.h>
#ifndef WIN32
#include <unistd.h>
#endif

#ifdef WIN32
#define stat _stat
#endif

int main() {

    time_t prevtime = 0;
    const char* filename = "log.txt";
    bool active = false;

    while (1) {
        struct stat result;
        if (stat(filename, &result) == 0)
        {
            auto mod_time = result.st_mtime;

            if (mod_time - prevtime > 0) {
                prevtime = mod_time;
                active = true;
            }
        }

        std::fstream fs;

        fs.open(filename, std::ios_base::in);
        std::string s;

        std::list<char*> rvqueue;


        while (fs && active)
        {

            std::getline(fs, s); // read each line into a string 

            if (rvqueue.size() >= 5) {
                char* element = rvqueue.front();

                if (element != nullptr) {
                    delete[] element;
                }

                rvqueue.pop_front();

                int len = s.length();
                char* newStr = new char[len + 1];
                memset(newStr, 0, len + 1);
                memcpy(newStr, s.c_str(), len + 1);

                rvqueue.push_back(newStr);
            }
            else {
                int len = s.length();
                char* newStr = new char[len + 1];
                memset(newStr, 0, len + 1);
                memcpy(newStr, s.c_str(), len + 1);

                rvqueue.push_back(newStr);
            }
        }

        active = false;

        while (!rvqueue.empty()) {
            char* element = rvqueue.front();

            std::cout << element << '\n';
            if (element != nullptr) {
                delete[] element;
            }

            rvqueue.pop_front();
        }
    }


	return 0;
}